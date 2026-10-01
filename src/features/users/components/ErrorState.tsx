import { Button, ButtonText } from "@/components/ui/button";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <VStack
      className="flex-1 items-center justify-center px-8 py-16"
      space="md"
    >
      <Icon as={AlertCircleIcon} size="xl" className="text-error-500" />
      <Text className="text-center text-typography-500" size="sm">
        Ocurrió un error al cargar los usuarios. Verifica tu conexión.
      </Text>
      <Button onPress={onRetry}>
        <ButtonText>Reintentar</ButtonText>
      </Button>
    </VStack>
  );
};
