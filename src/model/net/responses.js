// Instead of LoginResponse class:
export const handleLoginResponse = (response) => {
    // Store token if present
    if (!response) throw ResponseError('Login response invalid: response is null')
    if (!response.auth_token) throw ResponseError('Login response invalid: auth_token is null')
    return response.auth_token
};

export const handleUserRolesResponse = (response) => {
    // Check if the response exists
    if (!response) throw new ResponseError('User roles response invalid: response is null');

    // Check if response is an array
    if (!Array.isArray(response)) throw new ResponseError('User roles response invalid: expected an array');

    // Process each role object in the array
    return response.map(roleData => {
        // Validate each role entry has company and role objects
        if (!roleData.company) throw new ResponseError('User role entry invalid: missing company object');
        if (!roleData.role) throw new ResponseError('User role entry invalid: missing role object');

        const {company, role} = roleData;
        const missingCompanyFields = [];
        const missingRoleFields = [];

        // Validate required company fields
        if (!company.id) missingCompanyFields.push('company.id');
        if (!company.name) missingCompanyFields.push('company.name');

        // Validate required role fields
        if (!role.id) missingRoleFields.push('role.id');
        if (!role.role_title) missingRoleFields.push('role.role_title');

        // Check if any required fields are missing
        if (missingCompanyFields.length > 0 || missingRoleFields.length > 0) {
            const missingFields = [...missingCompanyFields, ...missingRoleFields];
            throw new ResponseError(`User role entry invalid: missing required fields - ${missingFields.join(', ')}`);
        }

        // Transform the response to match the expected format in the UserRoles component
        return {
            id: role.id,
            company_name: company.name,
            profile_pic: role.profile_picture_url, // Using the role's profile picture
            title: role.role_title,
            // You can include additional fields if needed
            company_id: company.id,
            company_address: company.address,
            company_email: company.email,
            company_phone: company.phone,
            company_logo: company.logo_url,
            personnel_name: role.personnel_name,
            contact_data: role.contact_data
        };
    });
};

export const handleUserOrdersResponse = (response) => {
    // Check if the response exists
    if (!response) throw new ResponseError('User orders response invalid: response is null');

    // Check if response is an array
    if (!Array.isArray(response)) throw new ResponseError('User orders response invalid: expected an array');

    // Process each order object in the array
    return response.map(orderData => {
        // Validate each order entry has order object
        if (!orderData.order) throw new ResponseError('User order entry invalid: missing order object');

        const {company, order} = orderData;
        const missingOrderFields = [];

        // Validate required order fields
        if (!order.id) missingOrderFields.push('order.id');
        if (!order.name) missingOrderFields.push('order.name');

        // Check if any required fields are missing
        if (missingOrderFields.length > 0) {
            throw new ResponseError(`User order entry invalid: missing required fields - ${missingOrderFields.join(', ')}`);
        }

        // Transform the response to match the expected format in the UserOrders component
        return {
            id: order.id,
            name: order.name,
            description: order.description,
            icon: order.icon_picture_url,
            created_at: order.created_at,
            // Company info may be empty in some cases (as shown in your example)
            contractor: company?.name || null,
            contractor_logo: company?.logo_url || null,
            // Additional company fields if needed
            company_id: company?.id,
            company_address: company?.address,
            company_email: company?.email,
            company_phone: company?.phone
        };
    });
};

export const handleRoleDataResponse = (response) => {

};

class ResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResponseError: ';
    }
}

