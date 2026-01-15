import { useQuery } from "@tanstack/react-query";
import { favoritesAPI } from "../../api/favorites";

const useFavorites = () =>
{
    const { data: favorites = [], isLoading, error } = useQuery({
        queryKey: ["profile-favorites"],
        queryFn: async () => await favoritesAPI.getAll(),
        staleTime: 3 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    });

    return {
        favorites,
        isLoading,
        error
    };
};

export default useFavorites;