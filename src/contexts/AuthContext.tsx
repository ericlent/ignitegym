import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";

export type AuthContextDataProps = {
    user: UserDTO;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingUserStorageData: boolean;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userData);
        } catch (error) {
            throw error;
        }
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData);
            await storageAuthTokenSave({ token, refresh_token });
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserGet();
            const { token } = await storageAuthTokenGet();

            if (userLogged && token) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            setIsLoadingUserStorageData(true);
            const { data } = await api.post("/sessions", { email, password });

            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
                userAndTokenUpdate(data.user, data.token);
            }

        } catch (error) {
            throw (error);
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();
        } catch (error) {
            throw (error);
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);

        } catch (error) {
            throw (error);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);


    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);
        return () => {
            subscribe();
        };
    }, [signOut]);

    return (
        <AuthContext.Provider value={{ user, updateUserProfile, signIn, signOut, isLoadingUserStorageData }}>
            {children}
        </AuthContext.Provider>
    );
}