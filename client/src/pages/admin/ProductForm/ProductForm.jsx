import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { validateProduct } from "../../../utils/validateProduct";
import Loader from "../../../components/Loader/Loader"
import "./ProductForm.scss";
import toast from "react-hot-toast";
import useCategories from "../../../hooks/categories/useCategories";
import useProduct from "../../../hooks/products/useProduct";
import useCreateProduct from "../../../hooks/products/useCreateProduct";

const ProductForm = () => {
    const [form, setForm] = useState(
    {
        name: "",
        description: "",
        price: 1,
        discount: 0,
        stock: 0,
        image: "",
        category: ""
    });
    const [errors, setErrors] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();

    const { categories, isLoading: isLoadingCategories, error: errorCategories } = useCategories();
    const { product, isLoading: isLoadingProduct, error: errorProduct } = useProduct(id);

    useEffect(() => {
        if (product) {
            setForm(
            {
                name: product.name,
                category: product.category._id,
                description: product.description,
                price: product.price,
                discount: product.discount,
                stock: product.stock,
                image: product.image
            });
        }
    }, [product]);

    const mutation = useCreateProduct(id);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        const fieldErrors = validateProduct(name, value);

        setErrors(prev => {
            const newErrors = { ...prev, ...fieldErrors };
            if (!fieldErrors[name]) {
                delete newErrors[name];
            }
            return newErrors;
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
            
        Object.keys(form).forEach((key) => {
            const fieldErrors = validateProduct(key, form[key]);
            Object.assign(newErrors, fieldErrors);
        });
            
        setErrors(newErrors);
            
        if (Object.keys(newErrors).length > 0) {
            toast.error("Form is not valid");
            return;
        }
        await mutation.mutate({...form});

        setForm({
            name: "",
            description: "",
            price: 1,
            discount: 0,
            stock: 0,
            image: "",
            category: ""
        });
        setErrors({});
    }

    if(isLoadingCategories || isLoadingProduct)
    {
        return <Loader/>;
    }

    if (errorCategories)
    {
        return (
            <p className="loading-error">
                Error loading categories: {errorCategories.response?.data?.message || errorCategories.response?.data?.error || errorCategories.message}
            </p>
        )
    }

    if (errorProduct)
    {
        return (
            <p className="loading-error">
                Error loading product: {errorProduct.response?.data?.message || errorProduct.response?.data?.error || errorProduct.message}
            </p> 
        )
    }

    return (
        <div className="product-form-page">
            <form className="product-form" onSubmit={handleSubmit}>
                <h2 className="form-title">{id ? "Edit Product" : "Create New Product"}</h2>
                <p className="form-subtitle">Fill all fields for product {id ? "editing" : "creation"}</p>

                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Example: Rolex Datejust"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <p className="error-text">{errors.name}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        <option value={""}>Select category</option>
                        {categories?.map((category) =>
                            <option key={category._id} value={category._id}>{category.name}</option>
                        )}
                    </select>
                    {errors.category && <p className="error-text">{errors.category}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Short description (1-2 sentences)"
                        value={form.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {errors.description && <p className="error-text">{errors.description}</p>}
                </div>

                <div className="flex-container">
                    <div className="form-group">
                        <label htmlFor="price">Price (USD) *</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="9000"
                            value={form.price}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                        {errors.price && <p className="error-text">{errors.price}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Discount (%)</label>
                        <input
                            id="discount"
                            name="discount"
                            type="number"
                            placeholder="0"
                            value={form.discount}
                            onChange={handleChange}
                            min={0}
                            max={99}

                        />
                        {errors.discount && <p className="error-text">{errors.discount}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="stock">In stock *</label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        placeholder="15"
                        value={form.stock}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                    {errors.stock && <p className="error-text">{errors.stock}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL *</label>
                    <input
                        id="image"
                        name="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={form.image}
                        onChange={handleChange}
                        required
                    />
                    {errors.image && <p className="error-text">{errors.image}</p>}
                </div>

                {form.image && (
                    <img
                        className="image-preview"
                        src={form.image}
                        alt="Product preview"
                        onLoad={(e) => e.target.style.display = "block"}
                        onError={(e) => e.target.style.display = "none"}
                    />
                )}

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={mutation.isPending}>
                        {mutation.isPending ? "Saving..." : id ? "Update Product" : "Create Product"}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </button>
                </div>

                {mutation.isError && (
                    <div className="error-message">
                        Error: {mutation.error.response?.data?.message || mutation.error.response?.data?.error || mutation.error.message}
                    </div>
                )}
            </form>
        </div>
    );
}

export default ProductForm