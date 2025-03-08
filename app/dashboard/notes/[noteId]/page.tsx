"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import DeleteNoteButton from "./delete-note-button";

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, {
    noteId,
  });

  if (!note) {
    return null;
  }

  return (
    <div className="p-3 bg-slate-100 rounded-md border dark:bg-gray-700">
      <DeleteNoteButton noteId={note._id} />
      <p className="whitespace-pre-line break-words">{note?.text}</p>
    </div>
  );
}
