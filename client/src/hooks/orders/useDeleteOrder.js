import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => await ordersAPI.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders'], exact: false });

      const ordersArr = queryClient.getQueriesData({ queryKey: ['orders'] });

      ordersArr.forEach(([key, old = []]) => {
        queryClient.setQueryData(
          key,
          old.filter(o => o._id !== id)
        );
      });

      return { ordersArr };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      toast.success("Order deleted");
    },

    onError: (err, id, context) => {
      context.ordersArr.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
      toast.error(err.response?.data?.error || err.message);
    }
  });
};

export default useDeleteOrder;