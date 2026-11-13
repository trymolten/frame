"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DialogStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RenameProjectDialogProps extends DialogStateProps {
  name: string;
  onRename: (name: string) => void;
}

export function RenameProjectDialog({
  name,
  open,
  onOpenChange,
  onRename,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* DialogContent unmounts when closed, so the form starts fresh from
            the current name every time it opens. */}
        <RenameForm
          initialName={name}
          onSubmit={(next) => {
            if (next !== name) onRename(next);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function RenameForm({
  initialName,
  onSubmit,
}: {
  initialName: string;
  onSubmit: (name: string) => void;
}) {
  const [value, setValue] = useState(initialName);
  const trimmed = value.trim();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (trimmed) onSubmit(trimmed);
      }}
    >
      <DialogHeader>
        <DialogTitle>Rename project</DialogTitle>
        <DialogDescription>
          The new name shows up on your dashboard and in the editor.
        </DialogDescription>
      </DialogHeader>
      <Field>
        <FieldLabel htmlFor="project-name">Project name</FieldLabel>
        <Input
          id="project-name"
          autoFocus
          value={value}
          maxLength={80}
          onChange={(event) => setValue(event.target.value)}
        />
      </Field>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!trimmed}>
          Rename
        </Button>
      </DialogFooter>
    </form>
  );
}

interface DeleteProjectDialogProps extends DialogStateProps {
  name: string;
  onDelete: () => void;
}

export function DeleteProjectDialog({
  name,
  open,
  onOpenChange,
  onDelete,
}: DeleteProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the project, its chat history and every
            version of its code. You can&apos;t undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={onDelete}
          >
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
