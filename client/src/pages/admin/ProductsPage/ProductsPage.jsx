import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react"
import { productsAPI } from "../../../api/products.js"
import { NavLink } from "react-router-dom";

import Loader from "../../../components/Loader/Loader.jsx";
import ProductCardAdmin from "../../../components/ProductCardAdmin/ProductCardAdmin.jsx";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx"
import "./ProductsPage.scss"

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll({}),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      toast.success('Product deleted!');
    },
  });

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
  
  return (
    <div className="products-page">

      <div className="flex-container">
        <h5 className="manage-title">Manage shop products</h5>
        <NavLink to="/admin/create">
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

      {isLoading && <Loader />}

      {error && (
        <p className="error">
          Error loading products: {error.message}
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
      />
    </div>
  )
}

export default ProductsPage;