"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode, MouseEvent } from "react";

export default function LoadingButton({
  isLoading,
  children,
  loadingText,
  onClick,
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}) {
  return (
    <Button
      disabled={isLoading}
      className="flex gap-1 items-center"
      type="submit"
      onClick={(e) => {
        onClick?.(e);
      }}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
