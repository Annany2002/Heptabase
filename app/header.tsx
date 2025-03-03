import { ModeToggle } from "@/components/mode-toggle";
import { FilePen } from "lucide-react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import HamburgerMenu from "@/components/hamburger-menu";

export function Header() {
  return (
    <div className="dark:bg-neutral-950 z-10 border-b relative py-4 bg-neutral-50">
      <div className="container mx-auto flex items-center">
        <div className="flex flex-1 gap-8 items-center">
          <Link
            href={"/"}
            className="flex tracking-wide items-center gap-2 text-2xl"
          >
            HeptaBase
            <FilePen />
          </Link>
          <nav className="flex flex-1 gap-8 items-center">
            <Link className="hover:text-gray-400" href={"/dashboard"}>
              Documents
            </Link>
          </nav>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            <div className="lg:hidden block">
              <HamburgerMenu />
            </div>
            <ModeToggle />
            <HeaderActions />
          </div>
        </div>
      </div>
    </div>
  );
}
