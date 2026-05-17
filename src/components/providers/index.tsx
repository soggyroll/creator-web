/** @format */

"use client";

import { PropsWithChildren } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "../theme-provider";
import { ReactQueryProvider } from "./ReactQueryProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <TooltipProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TooltipProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
