import { useQuery } from "@tanstack/react-query";
import { productsAPI } from "../../api/products";

const useProduct = (id) =>
{
    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => await productsAPI.getById(id),
        enabled: !!id,
        staleTime: 3 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    });

    return {
        product,
        isLoading,
        error
    };
};

export default useProduct;