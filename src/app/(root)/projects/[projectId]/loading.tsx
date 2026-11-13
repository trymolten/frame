import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the editor's split: chat on the left, preview on the right.
export default function ProjectLoading() {
  return (
    <div role="status" className="flex h-full">
      <span className="sr-only">Opening project…</span>
      <div aria-hidden className="flex w-[35%] min-w-0 flex-col border-r">
        <div className="flex h-[49px] items-center gap-2 border-b px-4">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Skeleton className="ml-auto h-14 w-3/4 rounded-xl" />
          <Skeleton className="h-28 w-5/6 rounded-xl" />
        </div>
        <div className="p-3">
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
      <div aria-hidden className="flex flex-1 flex-col">
        <div className="flex h-[49px] items-center gap-2 border-b px-2">
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="ml-auto size-8 rounded-md" />
        </div>
        <div className="flex-1 p-3">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
