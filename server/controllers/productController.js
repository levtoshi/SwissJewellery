import Product from '../models/Product.js';

// GET /api/products - get products with filtration, search, sorting and pagination
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      hasDiscount,
      sort = '-createdAt'
    } = req.query;

    // Filter creation
    const filter = {};

    // Filter with category
    if (category) {
      filter.category = category;
    }

    // Search with name and description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter with price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter with stock
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Filter with discount
    if (hasDiscount === 'true') {
      filter.discount = { $gt: 0 };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price':
        sortOption = { price: 1 };
        break;
      case '-price':
        sortOption = { price: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case '-name':
        sortOption = { name: -1 };
        break;
      case 'createdAt':
        sortOption = { createdAt: 1 };
        break;
      case '-createdAt':
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Request
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    // General amount
    const total = await Product.countDocuments(filter);
    
    const hasMore = skip + products.length < total;

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
        hasMore
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount, stock, image, images, category } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      discount: discount || 0,
      stock: stock || 0,
      image,
      images: images || [image],
      category
    });
    
    await product.populate('category', 'name');
    
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount, stock, image, images, category } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, discount, stock, image, images, category },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product successfully deleted', product });
  } catch (error) {
    next(error);
  }
};