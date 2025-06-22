import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SptPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-headline font-semibold text-foreground mb-6">
          Standardized Psychological Tests
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Beck Anxiety Inventory Card */}
          <Card className="text-center hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Beck Anxiety Inventory (BAI)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 font-body">
                The Beck Anxiety Inventory (BAI) is a 21-item self-report questionnaire used to measure the severity of anxiety symptoms.
              </p>
              <div className="flex flex-col items-center space-y-2">
                <Button asChild variant="ghost" className="font-body text-accent hover:text-accent-foreground hover:bg-accent">
                  <Link href="/tests/bai">Start Test</Link>
                </Button>
                <Button asChild variant="link" className="font-body text-muted-foreground hover:text-foreground">
                  <Link href="tests/history/bai">View History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Beck Depression Inventory Card */}
          <Card className="text-center hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Beck Depression Inventory (BDI)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 font-body">
                The Beck Depression Inventory (BDI) is a self-report questionnaire used to assess the severity of depressive symptoms.
              </p>
              <div className="flex flex-col items-center space-y-2">
                <Button asChild variant="ghost" className="font-body text-accent hover:text-accent-foreground hover:bg-accent">
                  <Link href="/tests/bdi">Start Test</Link>
                </Button>
                <Button asChild variant="link" className="font-body text-muted-foreground hover:text-foreground">
                  <Link href="tests/history/bdi">View History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}