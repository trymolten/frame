"use client";

import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryKey,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import type {
  ProjectCardData,
  ProjectListPage,
} from "@/modules/dashboard/types";

type Patch = Partial<ProjectCardData> | "remove";

// Project lists live in both plain (`{ items }`) and infinite (`{ pages }`)
// caches; patch every one so a star or delete shows up everywhere at once.
function patchListData(old: unknown, id: string, patch: Patch): unknown {
  const apply = (page: ProjectListPage): ProjectListPage => ({
    ...page,
    items:
      patch === "remove"
        ? page.items.filter((item) => item.id !== id)
        : page.items.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
  });

  if (!old || typeof old !== "object") return old;
  if ("pages" in old) {
    const data = old as InfiniteData<ProjectListPage>;
    return { ...data, pages: data.pages.map(apply) };
  }
  if ("items" in old) return apply(old as ProjectListPage);
  return old;
}

export function useProjectActions() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const listKey = trpc.projects.list.pathKey();

  const applyOptimistic = async (id: string, patch: Patch) => {
    await queryClient.cancelQueries({ queryKey: listKey });
    const snapshot = queryClient.getQueriesData({ queryKey: listKey });
    queryClient.setQueriesData({ queryKey: listKey }, (old) =>
      patchListData(old, id, patch)
    );
    return { snapshot };
  };

  const rollback = (context?: { snapshot: [QueryKey, unknown][] }) => {
    context?.snapshot.forEach(([key, data]) =>
      queryClient.setQueryData(key, data)
    );
  };

  const refresh = () => queryClient.invalidateQueries({ queryKey: listKey });

  const setStarred = useMutation(
    trpc.projects.setStarred.mutationOptions({
      onMutate: ({ id, starred }) => applyOptimistic(id, { starred }),
      onError: (error, _input, context) => {
        rollback(context);
        toast.error(error.message);
      },
      onSettled: refresh,
    })
  );

  const rename = useMutation(
    trpc.projects.rename.mutationOptions({
      onMutate: ({ id, name }) => applyOptimistic(id, { name }),
      onSuccess: () => toast.success("Project renamed"),
      onError: (error, _input, context) => {
        rollback(context);
        toast.error(error.message);
      },
      onSettled: refresh,
    })
  );

  const remove = useMutation(
    trpc.projects.delete.mutationOptions({
      onMutate: ({ id }) => applyOptimistic(id, "remove"),
      onSuccess: () => toast.success("Project deleted"),
      onError: (error, _input, context) => {
        rollback(context);
        toast.error(error.message);
      },
      onSettled: refresh,
    })
  );

  return { setStarred, rename, remove };
}

export type ProjectActions = ReturnType<typeof useProjectActions>;
