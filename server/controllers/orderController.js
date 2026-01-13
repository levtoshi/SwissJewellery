import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, total, guestInfo, comment } = req.body;
    const userId = req.user?._id || null;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validation: if no user, guestInfo is required
    if (!userId && !guestInfo) {
      return res.status(400).json({ error: 'Guest information is required for guest orders' });
    }

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const orderData = {
      user: userId,
      items,
      totalAmount : total,
      comment: comment || '',
      status: 'new',
      address: guestInfo.address
    };

    // If guest - add guestInfo
    if (!userId && guestInfo) {
      orderData.guestInfo = guestInfo;
    }

    const order = await Order.create(orderData);
    await order.populate('items.product');
    await order.populate('user', 'email fullName address');

    // Clear cart if user autorized
    if (userId) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] }
      );
    }

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const isAdmin = req.user.role === 'admin';

    const filter = { deletedAt: null };

    // Admin can see all, user - only his / her
    if (!isAdmin) {
      filter.user = req.user._id;
    }
    
    // Filter with status
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('user', 'email fullName address')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'email fullName address');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Access check
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status - update status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'confirmed', 'assembled', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const oldStatus = order.status;

    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.quantity } });
      }
    } else if (oldStatus === 'cancelled' && status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.name} to uncancel order` });
        }
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
      }
    }

    order.status = status;
    await order.save();

    await order.populate('items.product');

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id - Soft delete (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
        deletedAt: new Date(),
        deletedBy: req.user._id
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted', order });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};