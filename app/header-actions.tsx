"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { LoaderCircle } from "lucide-react";

export function HeaderActions() {
  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>

      <Authenticated>
        <UserButton />
      </Authenticated>

      <AuthLoading>
        <div className="flex gap-2">
          <LoaderCircle className="animate-spin" />
          Loading
        </div>
      </AuthLoading>
    </>
  );
}
