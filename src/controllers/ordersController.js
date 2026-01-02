const db = require('../config/database');

const getAllOrders = async (req, res, next) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, 
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email
      FROM orders o
      INNER JOIN customers c ON o.customer_id = c.id
      ORDER BY o.order_date DESC
    `);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [orders] = await db.query(`
      SELECT o.*, 
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.address as customer_address
      FROM orders o
      INNER JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const [details] = await db.query(`
      SELECT od.*, p.name as product_name, p.image_url
      FROM order_details od
      INNER JOIN products p ON od.product_id = p.id
      WHERE od.order_id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        ...orders[0],
        items: details
      }
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    const { customer_id, items } = req.body;

    if (!customer_id || !items || items.length === 0) {
      const error = new Error('customer_id e items son requeridos');
      error.statusCode = 400;
      throw error;
    }

    await connection.beginTransaction();

    let total = 0;
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price, stock FROM products WHERE id = ?',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Producto ${item.product_id} no encontrado`);
      }

      if (products[0].stock < item.quantity) {
        throw new Error(`Stock insuficiente para producto ${item.product_id}`);
      }

      item.unit_price = products[0].price;
      item.subtotal = item.unit_price * item.quantity;
      total += item.subtotal;
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)',
      [customer_id, total, 'pending']
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.unit_price, item.subtotal]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        order_id: orderId,
        total: total
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      const error = new Error(`Status debe ser uno de: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};