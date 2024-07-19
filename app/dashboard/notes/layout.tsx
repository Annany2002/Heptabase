"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();

  const hasNotes = notes && notes.length > 0;

  return (
    <main className="space-y-6">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Notes</h1>
        <CreateNoteButton />
      </div>
      {!hasNotes && <NoNotes />}
      {hasNotes && (
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
      )}
    </main>
  );
}
function NoNotes() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="mt-10 w-[350px] flex flex-col gap-4 items-center justify-center">
        <CardHeader>
          <CardDescription className="text-lg">
            You haven&apos;t uploaded a note
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src="/undraw_add_files_re_v09g.svg"
            alt="upload-in-empty"
            height="150"
            width="150"
          />
        </CardContent>
        <CardFooter>
          <CreateNoteButton />
        </CardFooter>
      </Card>
    </div>
  );
}
