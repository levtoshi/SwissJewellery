import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../../api/products";
import toast from "react-hot-toast";

const useCreateProduct = (id) =>
{
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (data) => (id ?
            await productsAPI.update(id, data) :
            await productsAPI.create(data)),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });
            const previousProducts = queryClient.getQueryData(['products']);
            if (id)
            {
                queryClient.setQueriesData({ queryKey: ['products'] }, (old) =>
                {
                    if (!old)
                        return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            products: page.products.map(p => p._id === id ? { ...p, ...data } : p)
                        }))
                    };
                });
            }
            else
            {
                queryClient.setQueriesData({ queryKey: ['products'] }, (old) =>
                {
                    if (!old || old.pages.length === 0)
                        return old;
                    const tempId = `temp-${Date.now()}`;
                    return {
                        ...old,
                        pages: [
                            {
                                ...old.pages[0],
                                products: [{ _id: tempId, ...data }, ...old.pages[0].products]
                            },
                            ...old.pages.slice(1)
                        ]
                    };
                });
            }
            return { previousProducts };
        },
        onSuccess: (data) => {
            if (!id)
            {
                queryClient.setQueriesData({ queryKey: ['products'] }, (old) =>
                {
                    if (!old)
                        return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            products: page.products.map(p => p._id.startsWith('temp-') ? data : p)
                        }))
                    };
                });
            }
            queryClient.invalidateQueries({queryKey: ["products"], exact: false});
            queryClient.invalidateQueries({queryKey: ["product", id], exact: true});
            toast.success(`Product ${(id) ? "updated" : "added"}`);
            navigate("/admin/products");
        },
        onError: (error, id, context) => {
            queryClient.setQueriesData({ queryKey: ['products'] }, context.previousProducts);
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        }
    });

    return mutation;
}

export default useCreateProduct;