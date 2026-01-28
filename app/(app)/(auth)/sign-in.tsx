import { zodResolver } from '@hookform/resolvers/zod';
import auth, { signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

import AppleAuthentication from '~/src/components/apple-authentication/apple-authentication';
import { GoogleSignIn } from '~/src/components/google-authentication/google-sign-in';
import { ThemedLogo } from '~/src/components/themed-logo';
import { Button } from '~/src/components/ui/button';
import { Input } from '~/src/components/ui/input';
import { useSession } from '~/src/context/authentication-context';
import { signInSchema } from '~/src/schema/signin';
import { resetAndRedirect } from '~/src/utils/navigation-utils';

export default function SignIn() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { continueAsGuest } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isDirty },
    setValue,
  } = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(signInSchema),
  });

  const performSignIn = async ({
    email,
    password,
  }: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth(), email, password)
      .then(async data => {
        setIsLoading(false);
        if (data?.user?.emailVerified) {
          resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
        } else {
          Toast.show({
            type: 'error',
            text1:
              'Je potrebné overenie vášho e-mailu. Skontrolujte si svoju e-mailovú schránku',
            position: 'bottom',
          });
        }
      })
      .catch(error => {
        setIsLoading(false);

        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Nepodarilo sa prihlásiť',
          position: 'bottom',
        });
      });
  };

  // Pre-fill email if it comes from signup
  useEffect(() => {
    if (email) {
      setValue('email', email, { shouldValidate: true, shouldTouch: true });
    }
  }, [email, setValue]);

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
          <ThemedLogo width={220} height={110} className="mb-8" />
          <GoogleSignIn onLoadingChange={setIsOAuthLoading} />
          <AppleAuthentication onLoadingChange={setIsOAuthLoading} />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input
                placeholder="Zadajte svoj e-mail"
                placeholderClassName="text-sm"
                aria-labelledby="username"
                aria-errormessage="inputError"
                className="mt-4 w-[80%]"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading && !isOAuthLoading}
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
                placeholder="Zadajte svoje heslo"
                aria-labelledby="password"
                aria-errormessage="passwordError"
                className="mt-4 w-[80%]"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                autoCapitalize="none"
                autoComplete="password"
                editable={!isLoading && !isOAuthLoading}
              />
            )}
          />
          {touchedFields.password && errors.password && (
            <Text className="my-4 text-red-600">{errors.password.message}</Text>
          )}
          <Button
            disabled={!isDirty || !isValid || isLoading || isOAuthLoading}
            onPress={handleSubmit(performSignIn)}
            className="w-[80%] mt-4"
          >
            <Text>Prihlásiť sa</Text>
          </Button>

          <View className="flex-row gap-2">
            <Text className="text-lg text-foreground">Ešte nemáte účet?</Text>
            <Link href="/sign-up" disabled={isLoading || isOAuthLoading}>
              <Text className="text-lg font-bold text-terciary">
                Registrovať
              </Text>
            </Link>
          </View>

          <Link
            href="/forgotten-password"
            disabled={isLoading || isOAuthLoading}
          >
            <Text className="text-lg font-bold text-terciary">
              Zabudnuté heslo
            </Text>
          </Link>

          <Button
            variant="ghost"
            onPress={continueAsGuest}
            disabled={isLoading || isOAuthLoading}
            className="mt-4"
          >
            <Text className="text-muted-foreground">Pokračovať ako hosť</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
