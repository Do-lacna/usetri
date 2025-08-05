import { zodResolver } from "@hookform/resolvers/zod";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { forgottenPasswordSchema } from "../../../schema/forgotten-password-schema";

export default function ForgottenPassword() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isDirty },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(forgottenPasswordSchema),
    mode: "onChange",
  });

  const handlePasswordReset = async ({
    email,
  }: z.infer<typeof forgottenPasswordSchema>) => {
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in all fields');
    //   return;
    // }

    try {
      setLoading(true);
      // Create user with email and password
      const promiseResult = await auth().sendPasswordResetEmail(email);

      Toast.show({
        type: "success",
        text1:
          "Na vami zadaný e-mail bol zaslaný link na resetovanie hesla. Skontrolujte svoju e-mailovú schránku",
        position: "bottom",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Nastala chyba pri resetovaní hesla",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center gap-2">
      <View className="w-[220px] h-[110px] mb-8">
           <Image
                source={require("~/assets/images/usetri_inverted_logo.png")}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
      </View>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onBlur, onChange } }) => (
          <Input
            placeholder="Zadajte svoj e-mail"
            aria-labelledby="username"
            aria-errormessage="inputError"
            className="mt-4 w-[80%]"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            hasError={!!(touchedFields.email && errors.email)}
          />
        )}
      />
      {touchedFields.email && errors.email && (
        <Text className="my-4 text-red-600">{errors.email.message}</Text>
      )}

      <Button
        // disabled={!isDirty || !isValid}
        onPress={handleSubmit(handlePasswordReset)}
        className="w-[80%] mt-4"
      >
        <Text>Resetovať heslo</Text>
      </Button>
    </View>
  );
}
