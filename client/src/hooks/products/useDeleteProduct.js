import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI } from "../../api/products.js";
import toast from "react-hot-toast";

const useDeleteProduct = (selectedCategory, debouncedQuery, selectedSort) =>
{
    const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
            toast.success('Product deleted!');
        },
        onError: (error, id, context) => {
            queryClient.setQueryData(['products', selectedCategory, debouncedQuery, selectedSort], context.previousProducts);
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        }
    });

    return deleteMutation;
};

export default useDeleteProduct;