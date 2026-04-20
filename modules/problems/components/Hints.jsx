import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Hints = ({ hints }) => {
  if (!hints || (Array.isArray(hints) && hints.length === 0)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hints</CardTitle>
          <CardDescription>No hints available for this problem</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hints</CardTitle>
        <CardDescription>Helpful hints to guide your solution</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-auto pr-4">
          <div className="space-y-3">
            {Array.isArray(hints) ? (
              hints.map((hint, index) => (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm">{hint}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm">{hints}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};