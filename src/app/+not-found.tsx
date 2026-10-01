import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="flex-1 bg-background-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <VStack className="flex-1 justify-center px-6" space="md">
        <Heading size="2xl">Página no encontrada</Heading>
        <Text className="text-typography-500">
          La ruta que intentas abrir no existe en esta aplicación.
        </Text>
        <Link href="/" asChild>
          <Button className="mt-2 self-start">
            <ButtonText>Volver al inicio</ButtonText>
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}
