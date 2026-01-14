import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useUpdateOrderStatus = () =>
{
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => await ordersAPI.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => old.map(c => c._id === id ? { ...c, status: status } : c));
      return { previousOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Order status updated!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['orders'], context.previousCategories);
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  });

  return updateStatusMutation;
};

export default useUpdateOrderStatus;