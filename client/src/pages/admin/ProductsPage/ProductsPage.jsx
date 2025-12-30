import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce.js";
import toast from "react-hot-toast";
import { Plus } from "lucide-react"
import { productsAPI } from "../../../api/products.js"
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
  const debouncedQuery = useDebounce(searchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const LIMIT = 12;

  const queryClient = useQueryClient();

  const observerTarget = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", selectedCategory, debouncedQuery, selectedSort],
    queryFn: ({ pageParam = 1 }) => {
      return productsAPI.getAll({
        page: pageParam,
        limit: LIMIT,
        ...(selectedCategory && { category: selectedCategory }),
        ...(debouncedQuery && { search: debouncedQuery }),
        ...(selectedSort && { sort: selectedSort }),
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const products = data?.pages.flatMap(page => page.products) ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id) => productsAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData(['products', selectedCategory, debouncedQuery, selectedSort]);
      queryClient.setQueryData(['products', selectedCategory, debouncedQuery, selectedSort], (old) => ({
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          products: page.products.filter(p => p._id !== id)
        }))
      }));
      return { previousProducts };
    },
    onSuccess: () => {
      toast.success('Product deleted!');
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['products', selectedCategory, debouncedQuery, selectedSort], context.previousProducts);
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
    }
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