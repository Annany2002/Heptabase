"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { generatePremiumCode } from "@/lib/generate-premium-code";
import { toast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DialogClose } from "@radix-ui/react-dialog";

export default function CopyGenerate({
  premiumCode,
  setPremiumCode,
}: {
  premiumCode: string;
  setPremiumCode: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);
  const insertToken = useMutation(api.token.insertToken);
  const presentDate = new Date();
  const expireDate = new Date(presentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Get New Code
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[24rem]">
        <DialogHeader>
          <DialogTitle>Generate a New Premium Code</DialogTitle>
          <DialogDescription>
            The new premium code generated will be valid for one month from the
            date of it&apos;s creation
          </DialogDescription>
        </DialogHeader>
        {premiumCode === "" ? (
          <Button onClick={() => setPremiumCode(generatePremiumCode()[0])}>
            Generate
          </Button>
        ) : (
          <div className="w-full text-center py-2 border border-gray-100 rounded-lg">
            {premiumCode}
          </div>
        )}
        {premiumCode !== "" && (
          <div className="flex w-full justify-evenly">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  insertToken({
                    code: premiumCode,
                    createdAt: presentDate.toLocaleDateString(),
                    expiresAt: expireDate.toLocaleDateString(),
                  });
                  setOpen(false);
                  setPremiumCode("");
                }}
              >
                Copy
              </Button>
            </DialogClose>
            <Button onClick={() => setPremiumCode("")}>Reset</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
