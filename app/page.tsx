"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocument);

  return (
    <main className="flex flex-col gap-2 justify-center items-center min-h-screen">
      <Authenticated>
        <Button onClick={() => createDocument({ title: "Hello world" })}>
          Click Me
        </Button>
        {documents?.map((doc) => <div key={doc._id}>{doc.title}</div>)}
      </Authenticated>
    </main>
  );
}
