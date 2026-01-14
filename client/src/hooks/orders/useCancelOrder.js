import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useCancelOrder = () =>
{
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (id) => await ordersAPI.cancel(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => old.map(c => c._id === id ? { ...c, status: "canceled" } : c));
      return { previousOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order canceled!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['orders'], context.previousCategories);
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  });

  return cancelMutation;
}

export default useCancelOrder;