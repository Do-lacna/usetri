import { zodResolver } from '@hookform/resolvers/zod';
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import type { z } from 'zod';

import AppleAuthentication from '~/src/components/apple-authentication/apple-authentication';
import { GoogleSignIn } from '~/src/components/google-authentication/google-sign-in';
import { ThemedLogo } from '~/src/components/themed-logo';
import { Button } from '~/src/components/ui/button';
import { Input } from '~/src/components/ui/input';
import { useSession } from '~/src/context/authentication-context';
import { Eye } from '~/src/lib/icons/Eye';
import { EyeOff } from '~/src/lib/icons/EyeOff';
import { signInSchema } from '~/src/schema/signin';
import { resetAndRedirect } from '~/src/utils/navigation-utils';

export default function SignIn() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { continueAsGuest } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(async data => {
        setIsLoading(false);
        if (data?.user?.emailVerified) {
          resetAndRedirect('/(app)/main/(tabs)/discounts-screen');
        } else {
          Toast.show({
            type: 'error',
            text1: t('auth.email_verification_required'),
            position: 'bottom',
          });
        }
      })
      .catch(error => {
        setIsLoading(false);

        console.error(error);
        Toast.show({
          type: 'error',
          text1: t('auth.sign_in_failed'),
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
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-12">
            {/* Header Section */}
            <View className="items-center mb-12">
              <ThemedLogo className="mb-8" />
              <Text className="text-3xl font-bold text-foreground text-center">
                {t('auth.welcome_back')}
              </Text>
              <Text className="text-sm text-muted-foreground text-center mt-3">
                {t('auth.sign_in_subtitle')}
              </Text>
            </View>

            {/* Social Login Section */}
            <View className="mb-8 items-center justify-center gap-3">
              <GoogleSignIn onLoadingChange={setIsOAuthLoading} />
              <AppleAuthentication onLoadingChange={setIsOAuthLoading} />
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-3 text-muted-foreground text-xs">{t('auth.or')}</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Email/Password Form */}
            <View className="mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onBlur, onChange } }) => (
                  <Input
                    placeholder="E-mail"
                    placeholderClassName="text-sm"
                    aria-labelledby="username"
                    aria-errormessage="inputError"
                    className="w-full"
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
                <Text className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="relative w-full mt-3">
                    <Input
                      secureTextEntry={!showPassword}
                      placeholder="Heslo"
                      aria-labelledby="password"
                      aria-errormessage="passwordError"
                      className="w-full pr-12"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCapitalize="none"
                      autoComplete="password"
                      editable={!isLoading && !isOAuthLoading}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      hitSlop={8}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-muted-foreground" />
                      ) : (
                        <Eye size={20} className="text-muted-foreground" />
                      )}
                    </Pressable>
                  </View>
                )}
              />
              {touchedFields.password && errors.password && (
                <Text className="text-destructive text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}

              <Link
                href="/forgotten-password"
                disabled={isLoading || isOAuthLoading}
                className="self-end mt-2"
              >
                <Text className="text-sm text-terciary">{t('auth.forgot_password')}</Text>
              </Link>
            </View>

            {/* Sign In Button */}
            <Button
              disabled={!isDirty || !isValid || isLoading || isOAuthLoading}
              onPress={handleSubmit(performSignIn)}
              className="w-full"
            >
              <Text className="text-primary-foreground font-semibold">
                {t('auth.sign_in')}
              </Text>
            </Button>

            {/* Footer Links */}
            <View className="mt-auto pt-8">
              <View className="flex-row justify-center gap-1">
                <Text className="text-foreground">{t('auth.no_account')}</Text>
                <Link href="/sign-up" disabled={isLoading || isOAuthLoading}>
                  <Text className="font-semibold text-terciary">
                    {t('auth.register')}
                  </Text>
                </Link>
              </View>

              <Button
                variant="ghost"
                onPress={continueAsGuest}
                disabled={isLoading || isOAuthLoading}
                className="mt-4"
              >
                <Text className="text-muted-foreground">
                  {t('auth.continue_as_guest')}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
