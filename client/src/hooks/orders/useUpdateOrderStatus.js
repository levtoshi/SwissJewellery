import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";
import toast from "react-hot-toast";

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      ordersAPI.updateStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'], exact: false });

      const ordersArr = queryClient.getQueriesData({ queryKey: ['orders'] });

      ordersArr.forEach(([key, old = []]) => {
        queryClient.setQueryData(
          key,
          old.map(o =>
            o._id === id ? { ...o, status } : o
          )
        );
      });

      return { ordersArr };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      toast.success("Order status updated");
    },

    onError: (err, context) => {
      context.ordersArr.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
      toast.error(err.response?.data?.error || err.message);
    }
  });
};

export default useUpdateOrderStatus;