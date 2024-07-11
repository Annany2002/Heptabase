import { ModeToggle } from "@/components/mode-toggle";
import { FilePen } from "lucide-react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";

export function Header() {
  return (
    <div className="dark:bg-slate-700 py-4 bg-slate-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href={"/"}
          className="flex tracking-wide items-center gap-2 text-2xl"
        >
          HeptaBase
          <FilePen />
        </Link>
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
