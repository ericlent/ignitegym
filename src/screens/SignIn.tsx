import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { useState } from "react";

type FormDataProps = {
    email: string;
    password: string;
}

const signInSchema = yup.object({
    email: yup.string().required("Informe o e-mail."),
    password: yup.string().required("Informe a senha.").min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

export function SignIn() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();
    const { signIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signInSchema)
    });

    function handleNewAccount() {
        navigation.navigate("signUp");
    }

    async function handleSignIn({ email, password }: FormDataProps) {
        try {
            setIsLoading(true);
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
        }
    }

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

                    <Center gap={"$2"}>
                        <Heading color="$gray100">Acesse a sua conta</Heading>

                        <Controller
                            control={control}
                            name="email"
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
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.password?.message}
                                    onSubmitEditing={handleSubmit(handleSignIn)}
                                    returnKeyType="send"
                                />
                            )}
                        />

                        <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
                            Ainda não tem acesso?
                        </Text>
                        <Button title="Criar conta" variant="outline" onPress={handleNewAccount} />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    );
}