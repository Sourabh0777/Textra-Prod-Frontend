'use client';

import { useUser } from '@clerk/nextjs';
import { useFetchCustomersQuery } from '@/lib/api/endpoints/customerApi';
import { useFetchUserData } from '@/lib/hooks/useFetchUserData';

export default function NewPage() {
    const { user: clerkUser, isLoaded } = useUser();
    const { data: CustomersResponse, isLoading: loadingCustomers } = useFetchCustomersQuery(undefined, {
        skip: !isLoaded || !clerkUser,
    });
    const { user } = useFetchUserData();

    return (
        <div>
            <h1>New Page</h1>
            {/* Add your page content here */}
        </div>
    );
}
