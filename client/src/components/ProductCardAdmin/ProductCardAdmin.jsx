import React from "react";
import "./ProductCardAdmin.scss";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom"

const ProductCardAdmin = ({ product, onDelete }) => {
  const hasDiscount = product.discount > 0;

  return (
    <div className="product-admin-card">
      <div className="card-left">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="card-center">
        <div className="title-row">
          <h3 className="title">{product.name}</h3>
          <span className="category">{product.category.name}</span>
        </div>

        <p className="description">{product.description}</p>

        <div className="meta-row">
          <div className="price">
            <span className="current">${product.finalPrice}</span>
            {hasDiscount && <span className="old">${product.price}</span>}
            {hasDiscount && (
              <span className="discount">-{product.discount}%</span>
            )}
          </div>

          <span className="stock">Amount: {product.stock}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/admin/products/edit/${product._id}`} className="edit btn">
          <Pencil size={16} /> Edit
        </Link>
        
        <button className="delete btn" onClick={onDelete}>
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
