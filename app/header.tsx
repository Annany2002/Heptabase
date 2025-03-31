"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Crown, FilePen, ShieldBan } from "lucide-react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import HamburgerMenu from "@/components/hamburger-menu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Header() {
  const user = useQuery(api.user.getUser);

  return (
    <div className="dark:bg-neutral-950 z-10 border-b relative py-4 bg-neutral-50">
      <div className="container mx-auto flex gap-6 items-center">
        <div className="flex flex-1 gap-8 items-center justify-between">
          <Link
            href={"/"}
            className="flex tracking-wide items-center gap-2 text:xl lg:text-2xl"
          >
            HeptaBase
            {user?.isPremium ? <Crown color="#06b6d4" /> : <FilePen />}
          </Link>

          <div className="hidden lg:flex items-center gap-6 font-md">
            {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <Link href={"/admin"}>
                <ShieldBan size={20} color="cyan" />
              </Link>
            )}
            <Link className="hover:text-gray-500" href={"/dashboard/documents"}>
              Documents
            </Link>
            <Link className="hover:text-gray-500" href={"/dashboard/search"}>
              Search
            </Link>
            <Link className="hover:text-gray-500" href={"/dashboard/notes"}>
              Notes
            </Link>
            <Link className="hover:text-gray-500" href={"/pricing"}>
              <Authenticated>
                {user?.isPremium === false && (
                  <span className="text-cyan-500  hover:underline underline-offset-2 font-stretch-extra-condensed font-semibold">
                    Premium
                  </span>
                )}
              </Authenticated>
              <Unauthenticated>
                <span>Pricing</span>
              </Unauthenticated>
            </Link>
          </div>
        </div>
        <div className="flex gap-[20px] items-center">
          <div className="lg:hidden block">
            <HamburgerMenu />
          </div>
          <ModeToggle />
          <HeaderActions />
        </div>
      </div>
    </div>
  );
}
