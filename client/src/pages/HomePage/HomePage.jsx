import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce.js";
import { productsAPI } from "../../api/products.js"
import Loader from "../../components/Loader/Loader.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./HomePage.scss"
import SettingsPanel from "../../components/SettingsPanel/SettingsPanel.jsx";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const LIMIT = 12;
  const debouncedQuery = useDebounce(searchQuery);

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
        // це можна зробити rest оператором, щоб не створювати поробжній об'єкт і наповнювати його в if
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
    <div className="home-container">
      <h1 className="page-title">Jewellery catalog</h1>
      <p className="page-subtitle">Swiss jewellery for yours</p>

      <SettingsPanel selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        selectedSort={selectedSort} setSelectedSort={setSelectedSort}/>

      <div className="line"></div>

      <p className="products-amount">Found products: <strong>{products?.length || 0}</strong></p>

      {isLoading && <Loader />}

      {error && (
        <p className="product-error">
          Error loading products: {error.response?.data?.message || error.response?.data?.error || error.message}
        </p>
      )}

      {!isLoading && !error && products?.length === 0 && (
        <p className="product-error">No products found</p>
      )}

      {!isLoading && !error && products?.length > 0 && (
        <div className="products-container">
          {products?.map(product => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}

      {(isFetchingNextPage || hasNextPage) && (
        <div ref={observerTarget} className="observer">
          {isFetchingNextPage && <Loader />}
        </div>
      )}
    </div>
  )
}

export default HomePage