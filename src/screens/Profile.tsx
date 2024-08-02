import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
    const [userPhoto, setUserPhoto] = useState("https://pbs.twimg.com/profile_images/1778790400465031168/9fgelLEk_400x400.jpg");
    const toast = useToast();

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
                        setUserPhoto(photoURI);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto
                        source={{ uri: userPhoto }}
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
                        <Input placeholder="Nome" bg="$gray600" />
                        <Input value="eric@email.com" bg="$gray600" isReadOnly />
                    </Center>

                    <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize="$md" mt="$12" mb="$2">
                        Alterar Senha
                    </Heading>

                    <Center w="$full" gap="$4">
                        <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
                        <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
                        <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />

                        <Button title="Atualizar" />
                    </Center>
                </Center>

            </ScrollView>
        </VStack>
    )
}