import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {productsAPI} from "../../api/products.js"
import {categoriesAPI} from "../../api/categories.js"
import Loader from "../../components/Loader/Loader.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./HomePage.scss"

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categories, isLoadingCategories, errorCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  const { data: products, isLoadingProducts, errorProducts } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => productsAPI.getAll(selectedCategory ? {category: selectedCategory} : {}),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  // тимчасова заглушка, винесу це десь окремо коли буду робити весь функціонал з Cart
  const onAddToCart = (id) => {};

  return (
    <div className="home-container">
      <h1 className="page-title">Jewellery catalog</h1>
      <p className="page-subtitle">Swiss jewellery for yours</p>

      {isLoadingCategories && <Loader />}

      {errorCategories && (
        <p className="category-error">
          Error loading categories: {errorCategories.message}
        </p>
      )}

      {!isLoadingCategories &&
        !errorCategories &&
        categories?.length === 0 &&
        <p className="category-error">No categories found</p>
      }

      {!isLoadingCategories &&
        !errorCategories &&
        categories?.length > 0 &&
        <div className="categories-container">
          <span
            className={selectedCategory === null ? "active category" : "category "}
            onClick={() => setSelectedCategory(null)}
          >
            All products
          </span>
          {categories.length > 0 && categories.map((category, index) => (
            <span
              key={category._id}
              className={selectedCategory === category._id ? "active category" : "category"}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </span>
          ))}
        </div>
      }

      <div className="line"></div>

      <p className="products-amount">Found products: <strong>{products?.length || 0}</strong></p>

      {isLoadingProducts && <Loader />}

      {errorProducts && (
        <p className="product-error">
          Error loading products: {errorProducts.message}
        </p>
      )}

      {!isLoadingProducts && !errorProducts && products?.length === 0 && (
        <p className="product-error">No products found</p>
      )}

      {!isLoadingProducts && !errorProducts && products?.length > 0 && (
        <div className="products-container">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onAddToCart={onAddToCart}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage