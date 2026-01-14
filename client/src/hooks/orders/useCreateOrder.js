import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useCreateOrder = () =>
{
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const mutation = useMutation({
        mutationFn: async (data) => await ordersAPI.create(data),

        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] });

            const previousOrders = queryClient.getQueryData(['orders']) ?? [];

            const tempId = `temp-${Date.now()}`;

            queryClient.setQueryData(['orders'], (old = []) => [
                ...old,
                { _id: tempId, ...data }
            ]);

            return { previousOrders };
        },

        onSuccess: (createdOrder) => {
            queryClient.setQueryData(['orders'], (old = []) =>
                old.map(order =>
                    order._id.startsWith('temp-')
                    ? createdOrder
                    : order
                )
            );
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({queryKey: ["product"], exact: false});
            queryClient.invalidateQueries({queryKey: ["products"], exact: false});

            toast.success("Order placed successfully!");
            clearCart();
            navigate("/");
        },

        onError: (error, context) => {
            queryClient.setQueryData(['orders'], context.previousOrders);
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        }
    });

    return mutation;
};

export default useCreateOrder;