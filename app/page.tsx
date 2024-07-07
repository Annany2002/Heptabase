"use client";

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
    <main className="flex flex-col justify-center items-center min-h-screen">
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <button onClick={() => createDocument({ title: "Hello world" })}>
          Click Me
        </button>
        {documents?.map((doc) => <div key={doc._id}>{doc.title}</div>)}
      </Authenticated>
    </main>
  );
}
