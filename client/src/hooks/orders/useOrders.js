import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "../../api/orders";

const useOrders = () =>
{
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => await ordersAPI.getAll(),
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