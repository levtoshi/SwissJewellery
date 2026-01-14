import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useDeleteOrder = () =>
{
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id) => await ordersAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => old.filter(c => c._id !== id));
      return { previousOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Order soft deleted!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['orders'], context.previousCategories);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(errorMessage);
    }
  });

  return deleteMutation;
}

export default useDeleteOrder;