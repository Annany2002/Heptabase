import { ModeToggle } from "@/components/mode-toggle";
import { FilePen } from "lucide-react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="dark:bg-slate-700 z-10 relative py-4 bg-neutral-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <Link
            href={"/"}
            className="flex tracking-wide items-center gap-2 text-2xl"
          >
            HeptaBase
            <FilePen />
          </Link>
          <nav className="flex gap-8 items-center">
            <OrganizationSwitcher />
            <Link className="hover:text-gray-400" href={"/dashboard"}>
              Documents
            </Link>
          </nav>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            <ModeToggle />
            <HeaderActions />
          </div>
        </div>
      </div>
    </div>
  );
}
