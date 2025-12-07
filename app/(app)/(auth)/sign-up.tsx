import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import type { z } from 'zod';
import { ThemedLogo } from '~/src/components/themed-logo';
import { Button } from '~/src/components/ui/button';
import { Input } from '~/src/components/ui/input';
import { signUpSchema } from '~/src/schema/signup';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isDirty },
  } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const handleRegister = async ({
    email,
    password,
  }: z.infer<typeof signUpSchema>) => {
    try {
      setLoading(true);
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Send email verification
      await userCredential.user.sendEmailVerification();

      Toast.show({
        type: 'success',
        text1:
          'Verifikačný e-mail bol zaslaný na zadaný e-mail, overte svoj e-mail a môžte sa prihlásiť',
        position: 'bottom',
      });

      router.push({
        pathname: '/sign-in',
        params: { email: userCredential?.user?.email },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Nastala chyba pri registrácii',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center gap-2 py-8">
          <ThemedLogo width={200} height={100} className="mb-6" />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input
                placeholder="Zadajte svoj e-mail"
                aria-labelledby="username"
                aria-errormessage="inputError"
                className="w-[80%]"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                hasError={!!(touchedFields.email && errors.email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {touchedFields.email && errors.email && (
            <Text className="text-red-600 text-sm px-[10%]">
              {errors.email.message}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Zadajte svoje heslo"
                aria-labelledby="password"
                aria-errormessage="passwordError"
                className="mt-2 w-[80%]"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                hasError={!!(touchedFields.password && errors.password)}
                autoCapitalize="none"
                autoComplete="password-new"
              />
            )}
          />
          {touchedFields.password && errors.password && (
            <Text className="text-red-600 text-sm px-[10%]">
              {errors.password.message}
            </Text>
          )}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Zopakujte svoje heslo"
                aria-labelledby="password"
                aria-errormessage="passwordError"
                className="mt-2 w-[80%]"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                hasError={
                  !!(touchedFields.confirmPassword && errors.confirmPassword)
                }
                autoCapitalize="none"
                autoComplete="password-new"
              />
            )}
          />
          {touchedFields.confirmPassword && errors.confirmPassword && (
            <Text className="text-red-600 text-sm px-[10%]">
              {errors.confirmPassword.message}
            </Text>
          )}
          <Button
            disabled={loading}
            onPress={handleSubmit(handleRegister)}
            className="w-[80%] mt-6"
          >
            <Text>Registrovať</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
