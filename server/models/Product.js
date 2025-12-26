import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["Rings", "Earrings", "Pendants", "Bracelets", "Watches"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [1, "Price must be >= than 1 USD"],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, "Discount cannot be less than 0%"],
            max: [99, "Discount cannot be bigger than 99%"],
        },
        stock: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
            default: 0,
        },
        image: {
            type: String,
            required: [true, "Image required"],
            validate: {
                validator: function (v) {
                    return /^https?:\/\/.+/i.test(v);
                },
                message: "Incorrect URL format of the image",
            },
        },
    },
    {
        timestamps: true,
    }
);

productSchema.virtual("finalPrice").get(function () {
    if (this.discount > 0) {
        return Math.round(this.price * (1 - this.discount / 100));
    }
    return this.price;
});

productSchema.virtual("inStock").get(function () {
    return this.stock > 0;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;