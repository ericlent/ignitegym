import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";

export function HomeHeader() {
    return (
        <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
            <UserPhoto
                source={{ uri: "https://pbs.twimg.com/profile_images/1778790400465031168/9fgelLEk_400x400.jpg" }}
                w="$16"
                h="$16"
                alt="Imagem do usuário"
            />
            <VStack>
                <Text color="$gray100" fontSize={"$sm"}>Olá,</Text>
                <Heading color="$gray100" fontSize={"$md"}>Eric Quaresma</Heading>
            </VStack>
        </HStack>

    );
}