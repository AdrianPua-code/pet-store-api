const db = require('../config/database');

const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Obtener productos de la categoría
    const [products] = await db.query(
      'SELECT * FROM products WHERE category_id = ? AND is_active = TRUE',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...categories[0],
        products: products
      }
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      const error = new Error('El nombre de la categoría es requerido');
      error.statusCode = 400;
      throw error;
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: {
        id: result.insertId,
        name,
        description
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [result] = await db.query(
      'UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};