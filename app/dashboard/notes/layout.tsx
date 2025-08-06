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
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.user.getUser);
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();

  return (
    <main className="space-y-6 w-full px-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="font-bold text-3xl text-cyan-500">My Notes</h1>
          {user?.isPremium === false && (
            <span className="text-md text-gray-200">
              <span className="text-cyan-500 font-semibold">
                {10 - user?.notes}
              </span>{" "}
              notes available to upload. Upgrade to use more
            </span>
          )}
        </div>
        <CreateNoteButton />
      </div>
      {!notes && (
        <div className="flex gap-10">
          <div className="w-[300px] space-y-4">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="w-full h-[400px]" />
          </div>
        </div>
      )}

      {notes && notes.length === 0 && <NoNotes />}

      {notes && notes.length > 0 && (
        <div className="flex gap-12">
          <ul className="space-y-2 w-[200px]">
            {notes.map((note, _) => (
              <li
                className={`sm:text-sm md:text-base lg:text-lg hover:text-cyan-100 ${note._id === noteId && "text-cyan-300"}`}
                key={note._id}
              >
                {"- "}
                <Link href={`/dashboard/notes/${note._id}`}>
                  {note.text.substring(0, 24) + "..."}
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-4 rounded-md w-full">{children}</div>
        </div>
      )}
    </main>
  );
}
function NoNotes() {
  return (
    <div className="flex flex-col items-center  justify-center">
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
