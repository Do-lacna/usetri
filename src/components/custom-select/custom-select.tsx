import type { Option } from '@rn-primitives/select';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Define our option types
export type SelectOptionType = {
  value: string;
  label: string;
  icon?: string; // URL for the icon image
};

type CustomSelectProps = {
  options?: SelectOptionType[];
  value?: Option;
  onChange?: (value: Option) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: Option;
  error?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  optionClassName?: string;
  iconSize?: number;
};

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  defaultValue,
  error,
  disabled = false,
  className = '',
  labelClassName = '',
  selectClassName = '',
  optionClassName = '',
  iconSize = 24,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      className={selectClassName}
    >
      <SelectTrigger>
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder={placeholder}
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets}>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options?.map(option => {
            return (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
                className={optionClassName}
              >
                {/* {shopIcon && (
                  <Image
                    source={{ uri: shopIcon }}
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                  />
                )}
                {option.label} */}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
