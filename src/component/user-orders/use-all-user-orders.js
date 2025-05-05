// src/hook/queries/useUserRequestsQuery.js
import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import {orderService} from "../../model/service/order-service.js";

export function useAllUserOrders(options = {}) {
    const { user } = useAuthProvider();

    return useQuery({
        queryKey: ['userOrders'],
        queryFn: () => orderService.getUserOrders(user.id),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
        ...options
    });
}