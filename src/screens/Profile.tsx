import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png"

type FormDataProps = {
    name: string;
    email?: string;
    old_password?: string | null;
    password?: string | null;
    confirm_password?: string | null;
}

const profileSchema = yup.object({
    name: yup
        .string()
        .required("Informe o nome."),
    old_password: yup
        .string()
        .min(6, "A senha precisa ter no mínimo 6 caracteres.")
        .nullable()
        .transform((value) => !!value ? value : null),
    password: yup
        .string()
        .min(6, "A senha precisa ter no mínimo 6 caracteres.")
        .nullable()
        .transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref("password")], 'As senhas devem ser iguais.')
        .when("password", {
            is: (Field: any) => Field,
            then: (schema) =>
                schema.nullable().required("Informe a confirmação de senha").transform((value) => !!value ? value : null)
        })
});

export function Profile() {
    const toast = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4],
                quality: 1,
                allowsEditing: true,
                base64: true,
            });

            if (!photoSelected.canceled) {
                const photoURI = photoSelected.assets[0].uri;

                if (photoURI) {
                    const photoInfo = await FileSystem.getInfoAsync(photoURI) as {
                        size: number;
                    };

                    if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                        return toast.show({
                            placement: "top",
                            render: ({ id }) => (
                                <ToastMessage
                                    id={id}
                                    action="error"
                                    title="A imagem é muito grande. A imagem deve ter no máximo 5MB."
                                    onClose={() => toast.close(id)}
                                />
                            )
                        })
                    } else {
                        const fileExtension = photoURI.split(".").pop();

                        const photoFile = {
                            name: `${user.name}.${fileExtension}`.toLowerCase().replace(" ", "").trim(),
                            uri: photoURI,
                            type: `${photoSelected.assets[0].type}/${fileExtension}`
                        } as any;

                        const userPhotoUploadForm = new FormData();
                        userPhotoUploadForm.append("avatar", photoFile);

                        const avatarUpdatedResponse = await api.patch("/users/avatar", userPhotoUploadForm, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        const userUpdated = user;
                        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                        updateUserProfile(userUpdated);

                        toast.show({
                            placement: "top",
                            render: ({ id }) => (
                                <ToastMessage
                                    id={id}
                                    action="success"
                                    title="Foto atualizada!"
                                    onClose={() => toast.close(id)}
                                />
                            )
                        });
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true);
            const userUpdated = user;
            userUpdated.name = data.name;

            await api.put("/users", data);

            await updateUserProfile(userUpdated);

            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="success"
                        title="Perfil atualizado com sucesso!"
                        onClose={() => toast.close(id)}
                    />
                )
            });

            

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : "Não possível atualizar o perfil.";
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
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto
                        source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultUserPhotoImg}
                        alt="Foto do usuário"
                        size="xl"
                    />

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text
                            color="$green500"
                            fontFamily="$heading"
                            fontSize="$md"
                            mt="$2"
                            mb="$8"
                        >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>



                    <Center w="$full" gap="$4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="E-mail"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    value={value}
                                    isReadOnly
                                />
                            )}
                        />

                    </Center>

                    <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize="$md" mt="$12" mb="$2">
                        Alterar Senha
                    </Heading>

                    <Center w="$full" gap="$4">

                        <Controller
                            control={control}
                            name="old_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    secureTextEntry
                                    placeholder="Senha atual"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    errorMessage={errors.old_password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    secureTextEntry
                                    placeholder="Nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    errorMessage={errors.password?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange } }) => (
                                <Input
                                    secureTextEntry
                                    placeholder="Confirme a nova senha"
                                    bg="$gray600"
                                    onChangeText={onChange}
                                    errorMessage={errors.confirm_password?.message}
                                />
                            )}
                        />

                        <Button title="Atualizar" onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating} />
                    </Center>
                </Center>

            </ScrollView>
        </VStack>
    )
}