import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserWithEmailAndPassword,
  getAuth,
} from '@react-native-firebase/auth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
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
import { ThemedLogo } from '~/src/components/themed-logo';
import { Button } from '~/src/components/ui/button';
import { Input } from '~/src/components/ui/input';
import { Eye } from '~/src/lib/icons/Eye';
import { EyeOff } from '~/src/lib/icons/EyeOff';
import { signUpSchema } from '~/src/schema/signup';

export default function SignUp() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );

      // Send email verification
      await userCredential.user.sendEmailVerification();

      Toast.show({
        type: 'success',
        text1: t('auth.verification_email_sent'),
        position: 'bottom',
      });

      router.push({
        pathname: '/sign-in',
        params: { email: userCredential?.user?.email },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.register_error'),
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

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
                {t('auth.create_account')}
              </Text>
              <Text className="text-sm text-muted-foreground text-center mt-3">
                {t('auth.register_subtitle')}
              </Text>
            </View>

            {/* Registration Form */}
            <View className="mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onBlur, onChange } }) => (
                  <Input
                    placeholder="E-mail"
                    aria-labelledby="username"
                    aria-errormessage="inputError"
                    className="w-full"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    hasError={!!(touchedFields.email && errors.email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
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
                      placeholder={t('auth.password_placeholder')}
                      aria-labelledby="password"
                      aria-errormessage="passwordError"
                      className="w-full pr-12"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      hasError={!!(touchedFields.password && errors.password)}
                      autoCapitalize="none"
                      autoComplete="password-new"
                      editable={!loading}
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View className="relative w-full mt-3">
                    <Input
                      secureTextEntry={!showConfirmPassword}
                      placeholder={t('auth.confirm_password_placeholder')}
                      aria-labelledby="password"
                      aria-errormessage="passwordError"
                      className="w-full pr-12"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      hasError={
                        !!(
                          touchedFields.confirmPassword &&
                          errors.confirmPassword
                        )
                      }
                      autoCapitalize="none"
                      autoComplete="password-new"
                      editable={!loading}
                    />
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      hitSlop={8}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} className="text-muted-foreground" />
                      ) : (
                        <Eye size={20} className="text-muted-foreground" />
                      )}
                    </Pressable>
                  </View>
                )}
              />
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <Text className="text-destructive text-sm mt-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <Button
              disabled={!isDirty || !isValid || loading}
              onPress={handleSubmit(handleRegister)}
              className="w-full"
            >
              <Text className="text-primary-foreground font-semibold">
                {t('auth.register_free')}
              </Text>
            </Button>

            {/* Footer Links */}
            <View className="mt-auto pt-8">
              <View className="flex-row justify-center gap-1">
                <Text className="text-foreground">
                  {t('auth.have_account')}
                </Text>
                <Link href="/sign-in" disabled={loading}>
                  <Text className="font-semibold text-terciary">
                    {t('auth.sign_in')}
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
