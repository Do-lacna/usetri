import { zodResolver } from "@hookform/resolvers/zod";
import auth, { signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import type { z } from "zod";
import { signInSchema } from "~/schema/signin";
import { resetAndRedirect } from "~/utils/navigation-utils";
import { Button } from "../components/ui/button";
import { GoogleSignIn } from "../components/ui/google-sign-in";
import { Input } from "../components/ui/input";

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isDirty },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  const performSignIn = async ({
    email,
    password,
  }: z.infer<typeof signInSchema>) => {
    signInWithEmailAndPassword(auth(), email, password)
      .then(() => resetAndRedirect("/main"))
      .catch(console.error);
  };
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <GoogleSignIn />
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onBlur, onChange } }) => (
          <Input
            placeholder="Enter your username"
            aria-labelledby="username"
            aria-errormessage="inputError"
            className="mt-4 w-[80%]"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {touchedFields.email && errors.email && (
        <Text className="my-4 text-red-600">{errors.email.message}</Text>
      )}
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onBlur, onChange } }) => (
          <Input
            secureTextEntry
            placeholder="Enter your password"
            aria-labelledby="password"
            aria-errormessage="passwordError"
            className="mt-4 w-[80%]"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {touchedFields.password && errors.password && (
        <Text className="my-4 text-red-600">{errors.password.message}</Text>
      )}
      <Button
        disabled={!isDirty || !isValid}
        onPress={handleSubmit(performSignIn)}
        className="w-[80%] mt-4"
      >
        <Text>Sign In</Text>
      </Button>
    </View>
  );
}
