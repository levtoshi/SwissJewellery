import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";

const useOrders = (status, adminOnly) =>
{
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders", status, adminOnly],
        queryFn: async () => await ordersAPI.getAll({status, adminOnly}),
        staleTime: 3 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    });

    return {
        orders,
        isLoading,
        error
    };
};

export default useOrders;