import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, guestInfo, comment } = req.body;
    const userId = req.user?._id || null;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // General sum calc
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
      user: userId,
      items,
      totalAmount,
      comment: comment || '',
      status: 'new'
    };

    // If guest - add guestInfo
    if (!userId && guestInfo) {
      orderData.guestInfo = guestInfo;
    }

    const order = await Order.create(orderData);
    await order.populate('items.product');

    // Clear cart if user autorized
    if (userId) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { items: [] }
      );
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
      .populate('user', 'email fullName')
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
      .populate('user', 'email fullName');

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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

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