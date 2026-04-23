import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { forgottenPasswordSchema } from '~/src/schema/forgotten-password-schema';
import { logError } from '~/src/utils/analytics';

export default function ForgottenPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isDirty },
  } = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(forgottenPasswordSchema),
    mode: 'onChange',
  });

  const handlePasswordReset = async ({
    email,
  }: z.infer<typeof forgottenPasswordSchema>) => {
    try {
      setLoading(true);
      try {
        await sendPasswordResetEmail(getAuth(), email);
      } catch (error: any) {
        // Swallow user-not-found to prevent email enumeration — the user
        // sees the same generic success message regardless.
        if (error?.code !== 'auth/user-not-found') {
          throw error;
        }
        logError(error, 'forgottenPassword:unknownEmail');
      }

      Toast.show({
        type: 'success',
        text1: t('auth.password_reset_email_sent'),
        position: 'bottom',
      });

      router.back();
    } catch (error: any) {
      logError(error, 'forgottenPassword');

      let errorMessage = t('auth.password_reset_error');
      if (error?.code === 'auth/invalid-email') {
        errorMessage = t('auth.invalid_email');
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = t('auth.too_many_requests');
      }

      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-12 items-center justify-center">
          <ThemedLogo className="mb-12" />

          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            {t('auth.restore_password')}
          </Text>
          <Text className="text-sm text-muted-foreground text-center mb-8">
            {t('auth.restore_password_subtitle')}
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onBlur, onChange } }) => (
              <Input
                placeholder={t('auth.email_placeholder')}
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
              />
            )}
          />
          {touchedFields.email && errors.email && (
            <Text className="text-destructive text-sm mt-2">
              {errors.email.message}
            </Text>
          )}

          <Button
            onPress={handleSubmit(handlePasswordReset)}
            className="w-full mt-8"
            disabled={loading}
          >
            <Text className="text-primary-foreground font-semibold">
              {t('auth.reset_password_button')}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
