import { ToastMessage } from "@components/ToastMessage";
import { UserDTO } from "@dtos/UserDTOS";
import { set, useToast } from "@gluestack-ui/themed";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { createContext, ReactNode, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextProviderProps = {
    children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const toast = useToast();
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    
    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post("sessions", { email, password });

            if (data.user) {
                setUser(data.user);
            }

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro no servidor.";
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title={title}
                        onClose={() => toast.close(id)}
                    />
                )
            });
        }
    }


    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}