import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesAPI } from '../../../api/categories';
import { validateCategory } from "../../../utils/validateCategory";
import toast from 'react-hot-toast';
import Loader from '../../../components/Loader/Loader';
import "./CategoryForm.scss";

const CategoryForm = () => {
  const [form, setForm] = useState(
  {
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: category, isLoading, error: errorLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => await categoriesAPI.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });
  
  useEffect(() => {
    if (category) {
      setForm(
      {
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);
  
  const mutation = useMutation({
    mutationFn: async (data) => (id ?
      await categoriesAPI.update(id, data) :
      await categoriesAPI.create(data)),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previousCategories = queryClient.getQueryData(['categories']);
      if (id)
      {
        queryClient.setQueryData(['categories'], (old) => old.map(c => c._id === id ? { ...c, ...data } : c));
      }
      else
      {
        const tempId = `temp-${Date.now()}`;
        queryClient.setQueryData(['categories'], (old) => [...old, { _id: tempId, ...data }]);
      }
      return { previousCategories };
    },
    onSuccess: (data) => {
      if (!id)
      {
        queryClient.setQueryData(['categories'], (old) => old.map(c => c._id.startsWith('temp-') ? data : c));
      }
      queryClient.invalidateQueries({queryKey: ["categories"], exact: false});
      queryClient.invalidateQueries({queryKey: ["product"], exact: false});
      queryClient.invalidateQueries({queryKey: ["products"], exact: false});
      queryClient.invalidateQueries({queryKey: ["category", id], exact: true});
      toast.success(`Category ${(id) ? "updated" : "added"}`);
      navigate("/admin/categories");
    },
    onError: (error, context) => {
      queryClient.setQueryData(['categories'], context.previousCategories);
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm(prev => ({ ...prev, [name]: value }));
  
    const fieldErrors = validateCategory(name, value);
  
    setErrors(prev => {
      const newErrors = { ...prev, ...fieldErrors };
      if (!fieldErrors[name]) {
       delete newErrors[name];
      }
      return newErrors;
    });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let newErrors = {};
              
    Object.keys(form).forEach((key) => {
      const fieldErrors = validateCategory(key, form[key]);
      Object.assign(newErrors, fieldErrors);
    });
              
    setErrors(newErrors);
              
    if (Object.keys(newErrors).length > 0) {
      toast.error("Form is not valid");
      return;
    }
    await mutation.mutate({...form});
  
    setForm({
      name: "",
      description: ""
    });
    setErrors({});
  }
  
  if(isLoading)
  {
    return <Loader/>;
  }
  
  if (errorLoading)
  {
    return (
      <p className="loading-error">
        Error loading categories: {errorLoading.response?.data?.message || errorLoading.response?.data?.error || errorLoading.message}
      </p>
    )
  }

  return (
    <div className="category-form-page">
      <form className="category-form" onSubmit={handleSubmit}>
        <h2 className="form-title">{id ? "Edit Category" : "Create New Category"}</h2>
        <p className="form-subtitle">Fill all fields for category {id ? "editing" : "creation"}</p>

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Example: Watches"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Short description (1-2 sentences)"
            value={form.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <p className="error-text">{errors.description}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : id ? "Update Category" : "Create Category"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/categories")}
          >
            Cancel
          </button>
        </div>

        {mutation.isError && (
          <div className="error-message">
            Error: {mutation.error.response?.data?.message || mutation.error.response?.data?.error || mutation.error.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default CategoryForm