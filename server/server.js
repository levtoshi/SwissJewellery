import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { seedProducts } from "./data/seedData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected DB");
        // Autoseed DB
        seedDatabase();
    })
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// ============================================
// SEED DATABASE
// ============================================
const seedDatabase = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(seedProducts);
            console.log("DB was seeded");
        }
    } catch (err) {
        console.error("Error while sedding DB:", err.message);
    }
};

// ============================================
// ROUTES CRUD
// ============================================

/**
 * GET /api/products
 * Get all products with filtering
 */
app.get("/api/products", async (req, res) => {
    try {
        const { category } = req.query;

        const filter = category ? { category } : {};

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error while getting products", error: err.message });
    }
});

/**
 * GET /api/products/:id
 * Get product with ID
 */
app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: "Incorrect product ID", error: err.message });
    }
});

/**
 * POST /api/products
 * Create new product
 */
app.post("/api/products", async (req, res) => {
    const { title, category, description, price, discount, stock, image } = req.body;

    try {
        if (!title || !category || !description || !price || image === undefined) {
            return res.status(400).json({
                message: "All required fields must be filled"
            });
        }

        if (discount && (discount < 0 || discount >= 100)) {
            return res.status(400).json({
                message: "Discount must be from 0% to 99%"
            });
        }

        const newProduct = new Product({
            title,
            category,
            description,
            price,
            discount: discount || 0,
            stock: stock || 0,
            image,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({
            message: "Error while creating product",
            error: err.message
        });
    }
});

/**
 * PATCH /api/products/:id
 * Update product
 */
app.patch("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, category, description, price, discount, stock, image } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (title) product.title = title;
        if (category) product.category = category;
        if (description) product.description = description;
        if (price !== undefined) product.price = price;
        if (discount !== undefined) {
            if (discount < 0 || discount >= 100) {
                return res.status(400).json({
                    message: "Discount must be from 0% to 99%"
                });
            }
            product.discount = discount;
        }
        if (stock !== undefined) product.stock = stock;
        if (image) product.image = image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({
            message: "Error while updating product",
            error: err.message
        });
    }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product successfully deleted",
            product
        });
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting product",
            error: err.message
        });
    }
});

/**
 * GET /api/categories
 * Get categories
 */
app.get("/api/categories", (req, res) => {
    const categories = ["Rings", "Earrings", "Pendants", "Bracelets", "Watches"];
    res.json(categories);
});

// ============================================
// Server loading
// ============================================
app.listen(PORT, () => {
    console.log(`Server loaded at http://localhost:${PORT}`);
});