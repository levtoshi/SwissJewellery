import { useQuery } from "@tanstack/react-query";
import { categoriesAPI } from "../../api/categories";

const useCategories = () =>
{
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await categoriesAPI.getAll(),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

    return {
      categories,
      isLoading,
      error
    };
};

export default useCategories;