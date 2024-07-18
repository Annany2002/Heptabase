"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateNoteForm from "./create-note-form";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CreateNoteButton() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="w-5 g-5" /> Create Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Note</DialogTitle>
          <DialogDescription>Type a searchable note</DialogDescription>
        </DialogHeader>
        <CreateNoteForm
          onNoteCreated={() => {
            setIsOpen(false);
            toast({
              title: "Note Created",
              description: "Your note has been successfully created",
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
