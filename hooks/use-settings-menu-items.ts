// hooks/useDrawerMenu.ts
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '~/context/authentication-context';
import { WEBPAGE_LINKS } from '../lib/constants';
import {
  activateBrigader,
  deactivateBrigader,
} from '../persistence/theme-storage';

export interface MenuItem {
  id: string;
  label: string;
  onPress?: () => void; // Optional since toggle items handle their own press
  icon?: React.ComponentType<any>;
  iconRight?: React.ComponentType<any>;
  isThemeToggle?: boolean;
  isLanguageToggle?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export const useSettingsMenuItems = () => {
  const { signOut, deleteUserAccount, setBrigaderActive, brigaderActive } =
    useSession();
  const { t } = useTranslation();

  const menuSections: MenuSection[] = useMemo(
    () => [
      {
        id: 'ucet',
        title: t('menu.account_settings'),
        items: [
          {
            id: 'email',
            label: t('menu.email_password'),
            onPress: () => router.push('/profile'),
          },
          {
            id: 'predplatne',
            label: t('menu.subscription'),
            onPress: () => router.push('/change-password'),
          },
          {
            id: 'brigader',
            label: brigaderActive
              ? t('menu.deactivate_brigader')
              : t('menu.activate_brigader'),
            onPress: () => {
              if (brigaderActive) {
                deactivateBrigader();
                setBrigaderActive?.(false);
                return router.back();
              }
              activateBrigader();
              setBrigaderActive?.(true);
              return router.back();
            },
          },
          {
            id: 'odhlasit',
            label: t('menu.sign_out'),
            onPress: signOut,
          },
          {
            id: 'vymazatucet',
            label: t('menu.delete_account'),
            onPress: deleteUserAccount,
          },
        ],
      },
      {
        id: 'aplikacia',
        title: t('menu.application'),
        items: [
          {
            id: 'tema',
            label: t('menu.theme'),
            isThemeToggle: true,
          },
          {
            id: 'language',
            label: t('menu.language'),
            isLanguageToggle: true,
          },
          {
            id: 'preferencie',
            label: t('menu.preferences'),
            onPress: () => router.push('/settings'),
          },
        ],
      },
      {
        id: 'informacieapodpora',
        title: t('menu.info_support'),
        items: [
          {
            id: 'akotofunguje',
            label: t('menu.how_it_works'),
            onPress: async () => {
              await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.HOW_IT_WORKS);
            },
          },
          {
            id: 'politikacookies',
            label: t('menu.cookies'),
            onPress: async () => {
              await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.COOKIES);
            },
          },
          {
            id: 'ochranaosobnychudajov',
            label: t('menu.privacy_policy'),
            onPress: async () => {
              await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.PRIVACTY_POLICY);
            },
          },
          {
            id: 'podmienkypouzivania',
            label: t('menu.terms_of_service'),
            onPress: async () => {
              await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.TERMS_OF_SERVICE);
            },
          },
          {
            id: 'kontakt',
            label: t('menu.contact'),
            onPress: async () => {
              await WebBrowser.openBrowserAsync(WEBPAGE_LINKS.CONTACT);
            },
          },
        ],
      },
    ],
    [brigaderActive, signOut, deleteUserAccount, setBrigaderActive, t],
  );

  return {
    menuSections,
  };
};
