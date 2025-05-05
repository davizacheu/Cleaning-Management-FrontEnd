import { useQuery } from '@tanstack/react-query';


const getRoleInfo = (role) => {
    return role;
};

export function useGetRoleInfo(role) {
    return useQuery({
        queryKey: ['userRole', role.id],
        queryFn: () => getRoleInfo(role),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });
}