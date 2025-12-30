import { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from "../../api/products";
import Loader from '../../components/Loader/Loader';
import { ArrowLeft } from 'lucide-react';
import "./ProductPage.scss"

const ProductPage = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await productsAPI.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  // тимчасова заглушка, винесу це десь окремо коли буду робити весь функціонал з Cart
  const onAddToCart = (id) => {};

  if(isLoading)
  {
    return <Loader/>;
  }

  if (error)
  {
    return (
      <p className="loading-error">
        Error loading product: {error.response?.data?.message || error.response?.data?.error || error.message}
      </p> 
    );
  }

  return (
    <div className="product-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16}/>
        <p className="back-title">Back to search</p>
      </Link>

      <div className="product-details-container">
        <div className="images-container">
          <img className="main-img" src={product?.images[selectedImageIndex]} alt={product?.title} />
          <div className="thumbnails-container">
            {product?.images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={selectedImageIndex === index ? 'active' : ''}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </div>
            
        <div className="info-container">
          <div className="main-info-container">
            <span className="category-info">{product?.category?.name}</span>
            <span className={`stock ${
              product.stock === 0
                ? "out"
                : product.stock < 5
                ? "low"
                : "in"
            }`}>
              Amount: {product.stock}
            </span>
          </div>

          <h2 className="product-title">{product?.name}</h2>

          <p className="description-title">{product?.description}</p>

          <div className="price-container">
            {product?.discount > 0 && (
              <h3 className="old-price">${product?.price}</h3>
            )}
            <h3 className="price">${product?.finalPrice}</h3>
            {product?.discount > 0 &&
              <span className="discount-info">-{product?.discount}%</span>
            }
          </div>

          <button
              className="addToCart-btn"
              onClick={() => onAddToCart(product._id)}
              disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductPage;