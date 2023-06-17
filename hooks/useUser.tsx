import { User } from '@supabase/auth-helpers-nextjs'
import { useSessionContext, useUser as useSupaUser } from '@supabase/auth-helpers-react'
import { Subscription, UserDetails } from '@/types'
import { createContext, useState, useEffect, useContext } from 'react'

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsloadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase.from('users').select('*').single();
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .in('status', ['trialing', 'active'])
            .single();

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsloadingData(true);
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if (userDetailsPromise.status === 'fulfilled')
                        setUserDetails(userDetailsPromise.value.data as UserDetails);

                    if (subscriptionPromise.status === 'fulfilled')
                        setSubscription(subscriptionPromise.value.data as Subscription);

                    setIsloadingData(false);
                }
            );
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be used within a MyUserContextProvider.`);
    }
    return context;
};//ฟังชั่น useUser  context = ค่า UserContext ถ้า context === undefined throw error 


// .in('status', ['trialing', 'active']) กรอง "status" ฟิลด์ "status" เป็น "trialing" หรือ "active" เท่านั้น

// useSessionContext เป็นฟังก์ชั่นที่ใช้ในการเข้าถึงข้อมูลของเซสชัน (session)
// useSupaUser เข้าถึงข้อมูลผู้ใช้ใน Supabase  ฟังก์ชั่นนี้จะคืนค่า user object  เช่น id, email, metadata

// useState<UserDetails | null> สร้าง state ที่เก็บค่าของตัวแปรชนิด UserDetails หรือ null ได้