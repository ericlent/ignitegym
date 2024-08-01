import { VStack, Icon, Heading, HStack, Text, Image, Box } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import BodySVG from "@assets/body.svg";
import SeriesSVG from "@assets/series.svg";
import RepetitionSVG from "@assets/repetitions.svg";
import { Button } from "@components/Button";

export function Exercise() {
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <VStack flex={1}>
            <VStack px="$8" bg="$gray600" pt="$12">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl" />
                </TouchableOpacity>

                <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8">
                    <Heading color="$gray100" fontFamily="$heading" fontSize="$lg" flexShrink={1}>
                        Puxada Frontal
                    </Heading>
                    <HStack alignItems="center">
                        <BodySVG />
                        <Text color="$gray200" ml="$1" textTransform="capitalize">
                            Costas
                        </Text>
                    </HStack>
                </HStack>

            </VStack>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 62 }}>
                <VStack p="$8">
                    <Image
                        source={{
                            uri: "https://static.vecteezy.com/ti/vetor-gratis/p1/5363469-treinamento-fisico-dependencia-plano-ilustracao-treino-vicio-cansado-academia-viciado-exercicio-obcecado-levantador-de-peso-atleta-equilibrio-na-bola-com-pesos-personagem-de-desenho-animado-vetor.jpg",
                        }}
                        alt="Exercício"
                        mb="$3"
                        resizeMode="cover"
                        rounded="$lg"
                        w="$full"
                        h="$80"
                    />

                    <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
                        <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                            <HStack>
                                <SeriesSVG />
                                <Text color="$gray200" ml="$2">
                                    3 séries
                                </Text>
                            </HStack>
                            <HStack>
                                <RepetitionSVG />
                                <Text color="$gray200" ml="$2">
                                    12 repetições
                                </Text>
                            </HStack>
                        </HStack>

                        <Button title="Marcar como realizado" />
                    </Box>

                </VStack>
            </ScrollView>
        </VStack>
    )
}