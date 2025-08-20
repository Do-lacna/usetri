import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Text } from "../text";

const NoDataText = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => {
    return (
      <Text
        className={cn("text-lg font-semibold text-muted-foreground", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
NoDataText.displayName = "NoDataText";

export { NoDataText };
