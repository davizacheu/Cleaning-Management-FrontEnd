import { useMutation, useQueryClient } from '@tanstack/react-query';
import {roleService} from "../model/service/role-service.js";


export function useJoinCompanyMutation({roleId, options = {}}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => roleService.joinCompany(roleId),
        onMutate: () => {
            if(options.onMutate) options.onMutate();
        },
        onSuccess: () => {
            // Invalidate and refetch the roles query to update UI
            queryClient.invalidateQueries(['addNewCompany']);
            if (options.onSuccess) options.onSuccess();
        },
        onError: (error) => {
            console.error('Failed to add order:', error);
            if (options.onError) options.onError(error);
        },
    });
}