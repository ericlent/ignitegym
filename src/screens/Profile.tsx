import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function Profile() {
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt="$6" px="$10">
                    <UserPhoto
                        source={{ uri: "https://pbs.twimg.com/profile_images/1778790400465031168/9fgelLEk_400x400.jpg" }}
                        alt="Foto do usuário"
                        size="xl"
                    />

                    <TouchableOpacity>
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