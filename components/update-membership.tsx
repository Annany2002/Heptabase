"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "./ui/use-toast";
import { useMutation, useQuery } from "convex/react";

export function UpdateMembership({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useQuery(api.user.getUser);
  const updateMembership = useMutation(api.user.updateMembership);
  const [premiumCode, setPremiumCode] = useState("");
  const router = useRouter();

  const updateMembershipHandler = () => {
    if (premiumCode === process.env.NEXT_PUBLIC_CODE!) {
      updateMembership({ userId: user?._id! });
      toast({ description: "Membership Updated" });
      router.push("/dashboard/documents");
    } else {
      toast({
        title: "Membership Declined",
        description: "Invalid Code",
        variant: "destructive",
      });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-500"
          variant="outline"
        >
          Subscribe Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Proceed to Premium Membership</DialogTitle>
          <DialogDescription>
            Add the secret code to unlock all the features of Premium
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              id="code"
              type="password"
              value={premiumCode}
              placeholder="abc-def-hijk"
              className="col-span-3"
              onChange={(e) => setPremiumCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={updateMembershipHandler} type="submit">
            Become Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
