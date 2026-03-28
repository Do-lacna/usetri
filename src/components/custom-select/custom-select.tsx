import type { Option } from '@rn-primitives/select';
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

export type SelectOptionType = {
  value: string;
  label: string;
  icon?: string;
};

type CustomSelectProps = {
  options?: SelectOptionType[];
  value?: Option;
  onChange?: (value: Option) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: Option;
  selectClassName?: string;
  optionClassName?: string;
};

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  defaultValue,
  selectClassName = '',
  optionClassName = '',
}: CustomSelectProps) => {
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
          className="text-foreground text-sm font-sans native:text-lg"
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
              />
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
