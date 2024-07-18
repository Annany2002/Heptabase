"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();

  return (
    <main className="space-y-6">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Notes</h1>
        <CreateNoteButton />
      </div>
      <div className="flex gap-12">
        <ul className="space-y-2 w-[200px]">
          {notes?.map((note) => (
            <li
              className={`text-lg hover:text-cyan-100 ${note._id === noteId && "text-cyan-300"}`}
              key={note._id}
            >
              <Link href={`/dashboard/notes/${note._id}`}>
                {note.text.substring(0, 24) + "..."}
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-4 rounded-md max-w-full">{children}</div>
      </div>
    </main>
  );
}
