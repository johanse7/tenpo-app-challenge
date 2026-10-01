import { memo, useCallback, useState } from "react";
import { Pressable } from "react-native";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
  LockIcon,
  MailIcon,
} from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = memo(function LoginForm() {
  const {
    email,
    password,
    errors,
    isPending,
    isServerError,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return (
    <VStack className="w-full" space="lg">
      <VStack space="xs">
        <Heading size="2xl">Bienvenido</Heading>
        <Text className="text-typography-500">
          Ingresa con tu cuenta para continuar
        </Text>
      </VStack>

      <VStack space="xs">
        <Input error={errors.email}>
          <InputSlot className="pl-3">
            <Icon as={MailIcon} className="text-typography-400" />
          </InputSlot>
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!isPending}
          />
        </Input>
      </VStack>

      <VStack space="xs">
        <Input error={errors.password}>
          <InputSlot className="pl-3">
            <Icon as={LockIcon} className="text-typography-400" />
          </InputSlot>
          <InputField
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            editable={!isPending}
          />
          <InputSlot className="pr-3">
            <Pressable
              onPress={togglePasswordVisibility}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <Icon
                as={isPasswordVisible ? EyeOffIcon : EyeIcon}
                className="text-typography-400"
              />
            </Pressable>
          </InputSlot>
        </Input>
      </VStack>

      {isServerError ? (
        <HStack className="items-center rounded-md bg-error-50 p-3" space="sm">
          <Icon as={AlertCircleIcon} className="text-error-500" />
          <Text className="flex-1 text-error-700" size="sm">
            No pudimos iniciar sesión. Intenta nuevamente.
          </Text>
        </HStack>
      ) : null}

      <Button onPress={handleSubmit} isDisabled={isPending}>
        {isPending ? <ButtonSpinner className="mr-2" /> : null}
        <ButtonText>{isPending ? "Ingresando…" : "Iniciar sesión"}</ButtonText>
      </Button>

      <Text className="text-center text-typography-400" size="xs">
        Demo: cualquier email válido y contraseña de 8+ caracteres.
      </Text>
    </VStack>
  );
});
