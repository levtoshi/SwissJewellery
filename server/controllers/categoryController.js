import Category from '../models/Category.js';
import Product from '../models/Product.js';

// GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    
    // Check if product is in this category
    const productsCount = await Product.countDocuments({ category: categoryId });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: 'Unable to delete category with products',
        productsCount,
        message: 'Firstly move products to another category'
      });
    }
    
    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category successfully deleted', category });
  } catch (error) {
    next(error);
  }
};