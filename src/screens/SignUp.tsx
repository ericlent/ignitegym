import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg"
import * as yup from "yup";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
//import { Alert } from "react-native";
//import axios from "axios";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required("Informe o nome."),
    email: yup.string().required("Informe o e-mail.").email("E-mail inválido."),
    password: yup.string().required("Informe a senha.").min(6, "A senha precisa ter no mínimo 6 caracteres."),
    password_confirm: yup.string().required("Confirme a senha.").oneOf([yup.ref("password")], 'As senhas devem ser iguais.')
});

export function SignUp() {
    const toast = useToast();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await api.post("users", { name, email, password });
            await signIn(email, password);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Erro no servidor.";
            setIsLoading(false);
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

            /*
            if (axios.isAxiosError(error))
                Alert.alert(error.response?.data.message);
            */
        }
    }

    /*
    function handleSignUp({ name, email, password }: FormDataProps) {
        console.log(name, email, password);

        fetch("http://192.168.0.109:3333/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => console.log(data));
    }
    */

    /*
    async function handleSignUp({ name, email, password }: FormDataProps) {
        const response = await fetch("http://192.168.0.109:3333/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        console.log(data);
    }
    */

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1}>
                <Image
                    w="$full"
                    h={624}
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    position="absolute"
                />

                <VStack flex={1} px="$10" pb={"$16"}>
                    <Center my={"$24"}>
                        <Logo />

                        <Text color="$gray100" fontSize={"$sm"}>
                            Treine sua mente e seu corpo.
                        </Text>
                    </Center>

                    <Center gap={"$2"} flex={1}>
                        <Heading color="$gray100">Crie sua conta</Heading>

                        <Controller
                            control={control}
                            name="name"
                            //rules={{ required: "Informe o nome." }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                    returnKeyType="next"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            /*
                            rules={{
                                required: "Informe o e-mail.",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'E-mail inválido'
                                }
                            }}
                                */
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="E-mail"
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    errorMessage={errors.email?.message}
                                    returnKeyType="next"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            //rules={{ required: "Informe a senha." }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                    returnKeyType="next"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password_confirm"
                            //rules={{ required: "Informe a senha." }}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Confirme a senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    onSubmitEditing={handleSubmit(handleSignUp)}
                                    returnKeyType="send"
                                    errorMessage={errors.password_confirm?.message}
                                />
                            )}
                        />

                        <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)} isLoading={isLoading} />
                    </Center>

                    <Button title="Voltar para o login" variant="outline" mt="$12" onPress={handleGoBack} />
                </VStack>
            </VStack>
        </ScrollView>
    );
}