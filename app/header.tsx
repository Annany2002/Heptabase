import { ModeToggle } from "@/components/mode-toggle";
import { FilePen } from "lucide-react";
import { HeaderActions } from "./header-actions";

export function Header() {
  return (
    <div className="dark:bg-slate-500 py-4 bg-slate-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex tracking-wide items-center gap-2 text-2xl">
          HeptaBase
          <FilePen />
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
