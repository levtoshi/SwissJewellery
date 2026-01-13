import { ShoppingCart, CircleAlert } from "lucide-react";
import "./ProductCard.scss";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discount > 0;

  const savingPrice = (product?.price - product?.finalPrice);
  const navigate = useNavigate();

  const { addItem } = useCart();

  const handleAddToCart = (e) =>
  {
    e.stopPropagation();
    addItem(product);
  }

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} />

        {hasDiscount && (
          <span className="discount-info">
            -{product.discount}%
          </span>
        )}

        {product.stock === 0 && (
          <span className="out-stock-info">
            OUT OF STOCK
          </span>
        )}
      </div>

      <div className="info-container">
        <p className="category-info">{product.category.name}</p>

        <h3 className="product-title">{product.name}</h3>

        <p className="product-description">
          {product.description.slice(0, 90)}
          {product.description.length > 90 && "..."}
        </p>

        <div className="price-container">
          <span className="price">${product.finalPrice}</span>

          {hasDiscount && (
            <span className="old-price">
              ${product.price}
            </span>
          )}
        </div>

        {savingPrice > 0 &&
          <p className="saving-info">
            Saving ${savingPrice.toFixed(2)}
          </p>
        }

        <p
          className={`stock-info ${
            product.stock === 0
              ? "out"
              : product.stock < 5
              ? "low"
              : "in"
          }`}
        >
          {product.stock >= 5 && `In stock: ${product.stock}`}
          {product.stock < 5 && product.stock > 0 &&
            <>
              <CircleAlert size={16} /> {`Remained ${product.stock} !`}
            </>
          }
          {product.stock === 0 && "Out of stock"}
        </p>

        <button
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;