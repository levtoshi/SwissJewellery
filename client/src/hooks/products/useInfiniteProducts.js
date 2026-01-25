import { productsAPI } from "../../api/products.js";
import { useInfiniteQuery } from "@tanstack/react-query";

const useInfiniteProducts = (selectedCategory, debouncedQuery, selectedSort) =>
{
    const LIMIT = 12;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["products", selectedCategory, debouncedQuery, selectedSort],
        queryFn: ({ pageParam = 1 }) => {
        return productsAPI.getAll({
            page: pageParam,
            limit: LIMIT,
            // це можна зробити rest оператором, щоб не створювати поробжній об'єкт і наповнювати його в if
            ...(selectedCategory && { category: selectedCategory }),
            ...(debouncedQuery && { search: debouncedQuery }),
            ...(selectedSort && { sort: selectedSort }),
        });
        },
        getNextPageParam: (lastPage) => {
        return lastPage.pagination.hasMore
            ? lastPage.pagination.page + 1
            : undefined;
        },
        staleTime: 3 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const products = data?.pages.flatMap(page => page.products) ?? [];

    return {
        products,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    };
};

export default useInfiniteProducts;