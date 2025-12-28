import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    // User (null if guest)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    
    // Guest data (if user === null)
    guestInfo: {
      fullName: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        lowercase: true,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      }
    },
    
    // Products in the order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],
    
    // General sum
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    
    // Order status
    status: {
      type: String,
      enum: ['new', 'confirmed', 'assembled', 'shipped', 'delivered', 'cancelled', 'deleted'],
      default: 'new'
    },
    
    // Order comment
    comment: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Comment must be shorter than 500 chars']
    },
    
    // Soft delete
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Get orders without deleted
OrderSchema.statics.findActive = function() {
  return this.find({ deletedAt: null });
};

// Virtual field - if order is deleted
OrderSchema.virtual('isDeleted').get(function () {
  return this.deletedAt !== null;
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;