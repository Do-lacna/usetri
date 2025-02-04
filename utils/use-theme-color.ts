import tailwindConfig from "~/tailwind.config";

export const useThemeColors = () => {
  if (!tailwindConfig?.theme?.colors) {
    return null;
  }
  return tailwindConfig.theme.colors;
};
