"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { FilePen } from "lucide-react";

export function Header() {
  return (
    <div className="dark:bg-slate-500 py-4 bg-slate-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex tracking-wide items-center gap-2 text-2xl">
          HeptaBase
          <FilePen />
        </div>
        <div>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
          <Authenticated>
            <div className="flex gap-4">
              <ModeToggle />
              <UserButton />
            </div>
          </Authenticated>
        </div>
      </div>
    </div>
  );
}
