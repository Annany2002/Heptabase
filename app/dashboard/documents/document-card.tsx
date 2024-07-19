"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function DocumentCard({ document }: { document: Doc<"documents"> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-400">
          {document.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="cursor-pointer">
        <HoverItem description={document.description} />
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="flex items-center gap-2"
          variant={"secondary"}
        >
          <Link href={`/documents/${document._id}`}>
            <EyeIcon className="w-4 h-4" /> View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function HoverItem({ description }: { description: string }) {
  const sliceDescription =
    description.substring(0, 85).concat("...") || "Generating Descritption...";

  return (
    <HoverCard>
      <HoverCardTrigger>{sliceDescription}</HoverCardTrigger>
      <HoverCardContent>{description}</HoverCardContent>
    </HoverCard>
  );
}