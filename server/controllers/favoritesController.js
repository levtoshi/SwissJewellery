import User from '../models/User.js';
import Product from '../models/Product.js';

// GET /api/favorites
// GET /api/favorites
export const getFavorites = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';

    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: { path: 'category', select: 'name' }
      })
      .select('favorites');

    const products = user.favorites.map(p => {
      const prod = p.toObject();
      prod.isFavorite = true; // 100% true тут
      return prod;
    });

    // favoritesCount тільки для адміна
    if (isAdmin) {
      const productIds = products.map(p => p._id);

      const counts = await User.aggregate([
        { $match: { favorites: { $in: productIds } } },
        { $unwind: '$favorites' },
        { $match: { favorites: { $in: productIds } } },
        { $group: { _id: '$favorites', count: { $sum: 1 } } }
      ]);

      const map = {};
      counts.forEach(c => map[c._id.toString()] = c.count);

      products.forEach(p => {
        p.favoritesCount = map[p._id.toString()] || 0;
      });
    }

    res.json(products);

  } catch (error) {
    next(error);
  }
};

// POST /api/favorites/:productId
export const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/favorites/:productId
export const removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite
};