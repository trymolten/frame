"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * shadcn's Textarea grows with `field-sizing: content`. Browsers without it
 * (e.g. Firefox) get the same behaviour here; CSS max-height still caps it.
 */
export function useAutosizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || CSS.supports("field-sizing", "content")) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, value]);
}
