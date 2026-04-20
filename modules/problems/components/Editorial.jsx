import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Editorial = ({ editorial }) => {
  if (!editorial) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Editorial</CardTitle>
          <CardDescription>Editorial not available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editorial</CardTitle>
        <CardDescription>Understand the approach to solve this problem</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-auto pr-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 pb-4">
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {editorial}
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};