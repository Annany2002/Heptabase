"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, {
    noteId,
  });

  return (
    <div className="p-3 bg-gray-700 w-[600px]">
      <p className="hyphens-auto break-words">{note?.text}</p>
    </div>
  );
}
