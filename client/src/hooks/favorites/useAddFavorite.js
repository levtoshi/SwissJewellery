import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesAPI } from "../../api/favorites";
import toast from "react-hot-toast";

const useAddFavorite = () =>
{
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id) => await favoritesAPI.add(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["profile-favorites"] });
            await queryClient.cancelQueries({ queryKey: ["products"] });
            await queryClient.cancelQueries({ queryKey: ["product", id] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
        },
        onSettled: (id) =>
        {
            queryClient.invalidateQueries({ queryKey: ["profile-favorites"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });
        }
    });

    return mutation;
};

export default useAddFavorite;