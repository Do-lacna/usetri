import tailwindConfig from "~/tailwind.config";

const useThemeColors = () => {
  if (!tailwindConfig?.theme?.colors) {
    return null;
  }
  return tailwindConfig.theme.colors;
};

export default useThemeColors;
