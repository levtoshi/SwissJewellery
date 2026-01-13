import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../../../api/categories";
import { Plus } from "lucide-react";
import Loader from "../../../components/Loader/Loader";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import CategoryCard from "../../../components/CategoryCard/CategoryCard"
import toast from "react-hot-toast";
import "./CategoriesPage.scss";

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const queryClient = useQueryClient();

  const { data: categories, isLoading: isLoading, error: error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await categoriesAPI.getAll(),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await categoriesAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousCategories = queryClient.getQueryData(['categories']);
      queryClient.setQueryData(['categories'], (old) => old.filter(c => c._id !== id));
      return { previousCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['categories'], context.previousCategories);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(errorMessage);
    }
  });

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutate(selectedCategory._id);
    closeModal();
  };

  return (
    <div className="categories-page">

      <div className="flex-container">
        <h5 className="manage-title">Manage shop categories</h5>
        <NavLink to="/admin/categories/create">
          <Plus /> Create Category
        </NavLink>
      </div>

      {isLoading && <Loader />}

      {error && (
        <p className="error">
          Error loading categories: {error.response?.data?.message || error.response?.data?.error || error.message}
        </p>
      )}

      {!isLoading &&
        !error &&
        categories?.length === 0 &&
        <p className="error">No categories found</p>
      }

      {!isLoading && !error && categories?.length > 0 && (
        <div className="categories-manage-container">
          {categories?.map(category => (
            <CategoryCard
                key={category._id}
                category={category} 
                onDelete={() => openModal(category)}/>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeModal}
        message={`Are you sure you want to delete "${selectedCategory?.name}"?`}
      />

      {deleteMutation.isError && (
        <div className="error-message">
          Error: {deleteMutation.error.response?.data?.message || deleteMutation.error.response?.data?.error || deleteMutation.error.message}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage