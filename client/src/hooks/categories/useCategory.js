import { useQuery } from "@tanstack/react-query";
import { categoriesAPI } from "../../api/categories";

const useCategory = (id) =>
{
    const { data: category, isLoading, error } = useQuery({
      queryKey: ["category", id],
      queryFn: async () => await categoriesAPI.getById(id),
      enabled: !!id,
      staleTime: 3 * 60 * 1000,
      cacheTime: 10 * 60 * 1000
    });

    return {
        category,
        isLoading,
        error
    };
};

export default useCategory;