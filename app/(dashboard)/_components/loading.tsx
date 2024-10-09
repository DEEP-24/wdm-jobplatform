import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function LoadingComponent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/3 space-y-4">
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
