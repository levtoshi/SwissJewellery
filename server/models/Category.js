import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Name must be longer than 2 chars'],
      maxlength: [50, 'Name must be shorter than 50 chars']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Category description must be shorter than 500 chars']
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', CategorySchema);

export default Category;