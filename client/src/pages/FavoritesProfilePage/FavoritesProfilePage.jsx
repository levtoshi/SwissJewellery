import ProductCard from "../../components/ProductCard/ProductCard";
import useFavorites from '../../hooks/favorites/useFavorites';
import Loader from "../../components/Loader/Loader";
import "./FavoritesProfilePage.scss";

const FavoritesProfilePage = () => {

  const { favorites = [], isLoading, error } = useFavorites();

  return (
    <div className='favorites-page'>
      <h1 className="page-title">Favorites catalog</h1>
      <p className="products-amount">Found products: <strong>{favorites?.length || 0}</strong></p>

      {isLoading && <Loader />}

      {error && (
        <p className="product-error">
          Error loading products: {error.response?.data?.message || error.response?.data?.error || error.message}
        </p>
      )}

      {!isLoading && !error && favorites?.length === 0 && (
        <p className="product-error">No products found</p>
      )}

      {!isLoading && !error && favorites?.length > 0 && (
        <div className="products-container">
          {favorites?.map(product => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesProfilePage;