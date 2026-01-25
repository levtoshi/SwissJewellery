import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  return useMutation({
    mutationFn: async (data) => await ordersAPI.create(data),

    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['orders'], exact: false });

      const ordersArr = queryClient.getQueriesData({ queryKey: ['orders'] });

      const tempOrder = {
        _id: `temp-${Date.now()}`,
        ...data,
        status: 'new',
        createdAt: new Date().toISOString(),
        optimistic: true
      };

      ordersArr.forEach(([key, old = []]) => {
        queryClient.setQueryData(key, [...old, tempOrder]);
      });

      return { ordersArr };
    },

    onSuccess: (order) => {
      queryClient.setQueriesData({ queryKey: ['orders'] }, (old = []) =>
        old.map(o => o.optimistic ? order : o)
      );

      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    },

    onError: (err, id, context) => {
      context.ordersArr.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );

      toast.error(err.response?.data?.error || err.message);
    }
  });
};

export default useCreateOrder;