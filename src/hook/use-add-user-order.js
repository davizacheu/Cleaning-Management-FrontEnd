// src/hook/mutations/useRequestMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {orderService} from "../model/service/order-service.js";

export function useAddOrderMutation(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderService.addOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(['userRequests']);
            if (options.onSuccess) {
                options.onSuccess();
            }
        },
        onError: (error) => {
            console.error('Failed to add order:', error);
            if (options.onError) {
                options.onError(error);
            }
        },
        ...options
    });
}