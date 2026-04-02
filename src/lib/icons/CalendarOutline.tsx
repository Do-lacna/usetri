import { Ionicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

const CalendarOutline = (
  props: Omit<React.ComponentProps<typeof Ionicons>, 'name'>,
) => <Ionicons name="calendar-outline" {...props} />;

cssInterop(CalendarOutline, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
      opacity: true,
    },
  },
});

export { CalendarOutline };
