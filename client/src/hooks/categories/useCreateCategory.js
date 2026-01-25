import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { categoriesAPI } from "../../api/categories";
import toast from "react-hot-toast";

const useCreateCategory = (id) =>
{
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
        onError: (error, id, context) => {
            queryClient.setQueryData(['categories'], context.previousCategories);
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        }
    });

    return mutation;
};

export default useCreateCategory;