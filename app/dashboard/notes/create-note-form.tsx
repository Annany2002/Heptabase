"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoadingButton from "@/components/loading-button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().min(1).max(5000),
});

export default function CreateNoteForm({
  onNoteCreated,
}: {
  onNoteCreated: () => void;
}) {
  const user = useQuery(api.user.getUser);
  const createNote = useMutation(api.notes.createNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote({
      text: values.text,
    });
    onNoteCreated();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder="Your Note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(user?.notes! <= 9 || user?.isPremium) && (
          <LoadingButton
            loadingText="Creating..."
            isLoading={form.formState.isSubmitting}
          >
            Create
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
