"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";

const formSchema = z.object({
  text: z.string().min(1).max(250),
});

export function QuestionForm({ documentId }: { documentId: Id<"documents"> }) {
  const user = useQuery(api.user.getUser);
  const askQuestion = useAction(api.documents.askQuestion);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await askQuestion({
      documentId,
      question: values.text,
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 gap-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  className="bg-neutral-200 dark:bg-transparent"
                  placeholder="Ask any question over this document"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {user?.questions! <= 9 && (
          <LoadingButton
            isLoading={form.formState.isSubmitting}
            loadingText="Submitting..."
          >
            Submit
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
