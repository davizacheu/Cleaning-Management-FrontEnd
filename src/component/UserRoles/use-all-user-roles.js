// src/hook/queries/useUserRolesQuery.js
import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from '../../hook/use-auth-provider.js';
import {roleService} from "../../model/service/role-service.js";

export function useAllUserRoles(options = {}) {
  const { user } = useAuthProvider();

  return useQuery({
    queryKey: ['userRoles'],
    queryFn: () => roleService.getUserRoles(user.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options
  });
}
