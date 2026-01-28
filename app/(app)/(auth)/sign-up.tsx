import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
          <View className="flex-1 px-8 py-8">
            {/* Header Section */}
            <View className="items-center mb-10">
              <ThemedLogo width={180} height={90} className="mb-6" />
              <Text className="text-2xl font-bold text-foreground text-center">
                Vytvorte si účet
              </Text>
              <Text className="text-base text-muted-foreground text-center mt-2">
                Zaregistrujte sa a začnite šetriť
              </Text>
            </View>

            {/* Registration Form */}
            <View className="mb-6">
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
                      placeholder="Heslo"
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
                      placeholder="Zopakujte heslo"
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
                Zaregistrovať sa
              </Text>
            </Button>

            {/* Footer Links */}
            <View className="mt-auto pt-8">
              <View className="flex-row justify-center gap-1">
                <Text className="text-foreground">Už máte účet?</Text>
                <Link href="/sign-in" disabled={loading}>
                  <Text className="font-semibold text-terciary">
                    Prihláste sa
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
