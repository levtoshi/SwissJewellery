import Loader from '../Loader/Loader';
import useCategories from "../../hooks/categories/useCategories.js";
import "./SettingsPanel.scss"

const SettingsPanel = ({selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    selectedSort, setSelectedSort
}) => {

  const { categories, isLoading: isLoadingCategories, error: errorCategories } = useCategories();

  return (
    <div className='settings-container'>
      {isLoadingCategories && <Loader />}

      {errorCategories && (
        <p className="category-error">
          Error loading categories: {errorCategories.response?.data?.message || errorCategories.response?.data?.error || errorCategories.message}
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

      <div className="search-container">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Search with name and description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

      <div className="sort-container">
        <select
            name="sort"
            id="sort"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="">Don't sort</option>
          <option value="price">Price increase</option>
          <option value="-price">Price decrease</option> 
          <option value="name">Name increase</option> 
          <option value="-name">Name decrease</option> 
          <option value="createdAt">Oldest</option> 
          <option value="-createdAt">Newest</option>
        </select>
      </div>
    </div>
  )
}

export default SettingsPanel