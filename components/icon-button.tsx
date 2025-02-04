import { ReactElement } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface IconButtonProps extends TouchableOpacityProps {
  children: ReactElement;
}

const IconButton = ({ children, style, ...props }: IconButtonProps) => (
  <TouchableOpacity accessible={true} accessibilityRole="button" {...props}>
    {children}
  </TouchableOpacity>
);

export default IconButton;
