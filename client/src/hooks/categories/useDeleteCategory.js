import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesAPI } from "../../api/categories";
import toast from "react-hot-toast";

const useDeleteCategory = () =>
{
    const queryClient = useQueryClient();

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
        onError: (error, id, context) => {
            queryClient.setQueryData(['categories'], context.previousCategories);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            toast.error(errorMessage);
        }
    });

    return deleteMutation;
};

export default useDeleteCategory;