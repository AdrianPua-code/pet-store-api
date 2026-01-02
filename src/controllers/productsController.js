const db = require('../config/database');

// Obtener todos los productos
const getAllProducts = async (req, res, next) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (products.length === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;

    if (!name || !price || stock === undefined) {
      const error = new Error('Campos requeridos: name, price, stock');
      error.statusCode = 400;
      throw error;
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category_id, image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: {
        id: result.insertId,
        name,
        price,
        stock
      }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, image_url, is_active } = req.body;

    const [result] = await db.query(
      `UPDATE products SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        stock = COALESCE(?, stock),
        category_id = COALESCE(?, category_id),
        image_url = COALESCE(?, image_url),
        is_active = COALESCE(?, is_active)
      WHERE id = ?`,
      [name, description, price, stock, category_id, image_url, is_active, id]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto (soft delete)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE products SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};