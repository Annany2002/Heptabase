import { ModeToggle } from "@/components/mode-toggle";
import { FilePen } from "lucide-react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import HamburgerMenu from "@/components/hamburger-menu";

export function Header() {
  return (
    <div className="dark:bg-neutral-950 z-10 border-b relative py-4 bg-neutral-50">
      <div className="container mx-auto flex gap-6 items-center">
        <div className="flex flex-1 gap-8 items-center justify-between">
          <Link
            href={"/"}
            className="flex tracking-wide items-center gap-2 text-2xl"
          >
            HeptaBase
            <FilePen />
          </Link>
          <div className="hidden lg:flex gap-6 font-md">
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
              Pricing
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
