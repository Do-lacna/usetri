import type { ReactElement } from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  children: ReactElement;
}

const IconButton = ({ children, style, ...props }: IconButtonProps) => (
  <TouchableOpacity
    accessible={true}
    accessibilityRole="button"
    style={style}
    {...props}
  >
    {children}
  </TouchableOpacity>
);

export default IconButton;
