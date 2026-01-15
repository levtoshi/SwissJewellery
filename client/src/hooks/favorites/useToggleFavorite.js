import { useState, useEffect } from "react";
import useAddFavorite from "../../hooks/favorites/useAddFavorite";
import useDeleteFavorite from "../../hooks/favorites/useDeleteFavorite";

const useToggleFavorite = (id, isFavorite) =>
{
    const [isActive, setIsActive] = useState(false);
    const addMutation = useAddFavorite();
    const deleteMutation = useDeleteFavorite();

    useEffect(() => {
        if (typeof isFavorite === "boolean") {
            setIsActive(isFavorite);
        }
    }, [isFavorite]);

    const toggle = () =>
    {
        if(!isActive)
        {
            addMutation.mutate(id);
        }
        else
        {
            deleteMutation.mutate(id);
        }
        setIsActive(!isActive);
    }

    return {
        isActive,
        toggle
    };
}

export default useToggleFavorite;