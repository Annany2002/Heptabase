"use client";

import LoadingButton from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteNoteButton({ noteId }: { noteId: Id<"notes"> }) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteNote = useMutation(api.notes.deleteNote);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger asChild>
        <div className="flex gap-1 float-right cursor-pointer">
          <Trash2 size={24} color="red" />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this noye?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your note can not be recovered after it&apos;s been deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            onClick={() => {
              setIsLoading(true);
              deleteNote({
                noteId,
              })
                .then(() => {
                  router.push("/dashboard/notes");
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
