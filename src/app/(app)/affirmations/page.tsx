"use client";

import * as React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePersonalizedAffirmations } from "@/ai/flows/generate-personalized-affirmations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Wand2 } from "lucide-react";

const affirmationFormSchema = z.object({
  goals: z.string().min(10, "Please describe your goals in a bit more detail.").max(500),
  challenges: z.string().min(10, "Please describe your challenges in a bit more detail.").max(500),
});

type AffirmationFormValues = z.infer<typeof affirmationFormSchema>;

export default function AffirmationsPage() {
  const [generatedAffirmations, setGeneratedAffirmations] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<AffirmationFormValues>({
    resolver: zodResolver(affirmationFormSchema),
    defaultValues: {
      goals: "",
      challenges: "",
    },
  });

  const onSubmit: SubmitHandler<AffirmationFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedAffirmations(null);
    try {
      const result = await generatePersonalizedAffirmations({
        goals: data.goals,
        challenges: data.challenges,
      });
      if (result && result.affirmations) {
        setGeneratedAffirmations(result.affirmations);
        toast({
          title: "Affirmations Generated!",
          description: "Your personalized affirmations are ready.",
        });
      } else {
        throw new Error("No affirmations returned from AI.");
      }
    } catch (error) {
      console.error("Error generating affirmations:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate affirmations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-semibold text-foreground flex items-center">
          <Sparkles className="mr-3 h-10 w-10 text-primary" /> Personalized Affirmations
        </h1>
        <p className="text-xl text-muted-foreground font-body">
          Craft positive statements tailored to your journey using AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Tell Us About Yourself</CardTitle>
            <CardDescription className="font-body">
              Share your goals and challenges to generate personalized affirmations.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-base">Your Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I want to feel more confident and reduce anxiety in social situations."
                          className="resize-none font-body"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-base">Your Challenges</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I often doubt myself and fear judgment from others."
                          className="resize-none font-body"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full font-body text-lg py-6">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-5 w-5" />
                  )}
                  Generate Affirmations
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className={`shadow-lg ${!generatedAffirmations && !isLoading ? 'flex items-center justify-center min-h-[300px]' : ''}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Your Affirmations</CardTitle>
            <CardDescription className="font-body">
              Read these affirmations daily to reinforce positive thinking.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="font-body text-lg">Generating your affirmations...</p>
              </div>
            )}
            {!isLoading && !generatedAffirmations && (
              <div className="text-center text-muted-foreground py-10">
                <Sparkles className="mx-auto h-16 w-16 opacity-50 mb-4" />
                <p className="font-body text-lg">Your affirmations will appear here once generated.</p>
              </div>
            )}
            {generatedAffirmations && (
              <div className="prose prose-lg font-body text-foreground whitespace-pre-line bg-primary/5 p-6 rounded-md">
                {generatedAffirmations.split('\n').map((line, index) => (
                  line.trim() && <p key={index} className="mb-3 leading-relaxed">{line}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
