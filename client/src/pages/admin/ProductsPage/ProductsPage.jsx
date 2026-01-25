import { useState, useRef, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce.js";
import useInfiniteProducts from "../../../hooks/products/useInfiniteProducts.js";
import useDeleteProduct from "../../../hooks/products/useDeleteProduct.js";
import { Plus } from "lucide-react"
import { NavLink } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.jsx";
import ProductCardAdmin from "../../../components/ProductCardAdmin/ProductCardAdmin.jsx";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import SettingsPanel from "../../../components/SettingsPanel/SettingsPanel.jsx";
import "./ProductsPage.scss";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const observerTarget = useRef(null);

  const debouncedQuery = useDebounce(searchQuery);
  const { products, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteProducts(selectedCategory, debouncedQuery, selectedSort);

  const deleteMutation = useDeleteProduct(selectedCategory, debouncedQuery, selectedSort);

  const amountOfProducts = products?.length;
  const amountOfProductsInStock = products?.filter(product => product.stock > 0).length;
  const amountOfProductsOutOfStock = products?.filter(product => product.stock == 0).length;
  const amountOfProductsWithDiscount = products?.filter(product => product.discount > 0).length;

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedProduct._id);
    closeModal();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
  
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
  
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  return (
    <div className="products-page">

      <div className="flex-container">
        <h5 className="manage-title">Manage shop products</h5>
        <NavLink to="/admin/products/create">
          <Plus /> Create Product
        </NavLink>
      </div>

      <div className="statistics-container">
        <div className="statistic-item">
          <p className="statistic-title">Amount of products</p>
          <h4 className="statistic-data">{amountOfProducts}</h4>
        </div>
        <div className="statistic-item">
          <p className="statistic-title">In stock</p>
          <h4 className="statistic-data">{amountOfProductsInStock}</h4>
        </div>
        <div className="statistic-item">
          <p className="statistic-title">Out of stock</p>
          <h4 className="statistic-data">{amountOfProductsOutOfStock}</h4>
        </div>
        <div className="statistic-item">
          <p className="statistic-title">With discount</p>
          <h4 className="statistic-data">{amountOfProductsWithDiscount}</h4>
        </div>
      </div>

      <SettingsPanel selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedSort={selectedSort} setSelectedSort={setSelectedSort}/>

      {isLoading && <Loader />}

      {error && (
        <p className="error">
          Error loading products: {error.response?.data?.message || error.response?.data?.error || error.message}
        </p>
      )}

      {!isLoading &&
        !error &&
        products?.length === 0 &&
        <p className="error">No products found</p>
      }

      {!isLoading && !error && products?.length > 0 && (
        <div className="products-manage-container">
          {products.map(product => (
            <ProductCardAdmin
                key={product._id}
                product={product} 
                onDelete={() => openModal(product)}/>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeModal}
        message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        confirmMessage="Yes, Delete"
      />

      {(isFetchingNextPage || hasNextPage) && (
        <div ref={observerTarget} className="observer">
          {isFetchingNextPage && <Loader />}
        </div>
      )}

      {deleteMutation.isError && (
        <div className="error-message">
          Error: {deleteMutation.error.response?.data?.message || deleteMutation.error.response?.data?.error || deleteMutation.error.message}
        </div>
      )}
    </div>
  )
}

export default ProductsPage;