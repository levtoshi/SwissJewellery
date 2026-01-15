import Product from '../models/Product.js';
import User from '../models/User.js';

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

    const filter = {};

    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (hasDiscount === 'true') filter.discount = { $gt: 0 };

    let sortOption = {};
    switch (sort) {
      case 'price': sortOption = { price: 1 }; break;
      case '-price': sortOption = { price: -1 }; break;
      case 'name': sortOption = { name: 1 }; break;
      case '-name': sortOption = { name: -1 }; break;
      case 'createdAt': sortOption = { createdAt: 1 }; break;
      case '-createdAt':
      default: sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    // Get products
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);
    const hasMore = skip + products.length < total;

    // Current user favorite
    let favoritesSet = new Set();
    const isAdmin = req.user?.role === 'admin';

    if (req.user) {
      const user = await User.findById(req.user._id).select('favorites');
      favoritesSet = new Set(user.favorites.map(f => f.toString()));
    }

    // Для адміна одразу отримуємо counts всіх продуктів у цьому списку
    let favoritesCountsMap = {};
    if (isAdmin) {
      const productIds = products.map(p => p._id);
      const counts = await User.aggregate([
        { $match: { favorites: { $in: productIds } } },
        { $unwind: '$favorites' },
        { $match: { favorites: { $in: productIds } } },
        { $group: { _id: '$favorites', count: { $sum: 1 } } }
      ]);
      counts.forEach(c => { favoritesCountsMap[c._id.toString()] = c.count; });
    }

    const productsWithFavorites = products.map(p => {
      const prod = p.toObject();
      prod.isFavorite = favoritesSet.has(prod._id.toString());
      if (isAdmin) prod.favoritesCount = favoritesCountsMap[prod._id.toString()] || 0;
      return prod;
    });

    res.json({
      products: productsWithFavorites,
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

    const prod = product.toObject();

    // isFavorite for current user
    let isFavorite = false;
    if (req.user) {
      const user = await User.findById(req.user._id).select('favorites');
      isFavorite = user.favorites.some(f => f.toString() === prod._id.toString());
    }
    prod.isFavorite = isFavorite;

    // favoritesCount for admin
    if (req.user?.role === 'admin') {
      const count = await User.countDocuments({ favorites: prod._id });
      prod.favoritesCount = count;
    }

    res.json(prod);

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