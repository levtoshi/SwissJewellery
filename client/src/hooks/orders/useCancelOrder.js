import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => await ordersAPI.cancel(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders'], exact: false });

      const ordersArr = queryClient.getQueriesData({ queryKey: ['orders'] });

      ordersArr.forEach(([key, old = []]) => {
        queryClient.setQueryData(
          key,
          old.map(o =>
            o._id === id ? { ...o, status: 'cancelled' } : o
          )
        );
      });

      return { ordersArr };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      toast.success("Order cancelled");
    },

    onError: (err, id, context) => {
      context.ordersArr.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
      toast.error(err.response?.data?.error || err.message);
    }
  });
};

export default useCancelOrder;