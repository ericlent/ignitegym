import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { createContext, ReactNode, useEffect, useState } from "react";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";

export type AuthContextDataProps = {
    user: UserDTO;
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

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData);
            await storageAuthTokenSave(token);
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
            const token = await storageAuthTokenGet();

            if (userLogged && token) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post("sessions", { email, password });
            console.log(data);

            if (data.user && data.token) {
                setIsLoadingUserStorageData(true);
                await storageUserAndTokenSave(data.user, data.token);
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

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoadingUserStorageData }}>
            {children}
        </AuthContext.Provider>
    );
}