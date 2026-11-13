import Image from "next/image";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Fragment, MessageType, MessageRole } from "@/generated/prisma/client";

import { Card } from "@/components/ui/card";

interface FragmentCardProps {
  fragment: Fragment;
  isActive: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActive,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 p-3 border rounded-lg text-start bg-muted  transition-colors w-fit hover:bg-secondary",
        isActive &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-xs">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-word">
        {content}
      </Card>
    </div>
  );
};

interface AssistantMessageProps {
  type: MessageType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  fragment: Fragment | null;
  onFragmentClick: (fragment: Fragment) => void;
}

const AssistantMessage = ({
  type,
  content,
  fragment,
  createdAt,
  updatedAt,
  isActive,
  onFragmentClick,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-destructive"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.png"
          alt="Molten"
          width={28}
          height={28}
          className="shrink-0 rounded-full"
        />
        <span className="text-sm text-medium">Molten</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
        <span className="hidden">{updatedAt.toISOString()}</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-4">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActive={isActive}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface ProjectMessageCardProps {
  content: string;
  role: MessageRole;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  fragment: Fragment | null;
  onFragmentClick: (fragment: Fragment) => void;
}

const ProjectMessageCard = ({
  content,
  role,
  type,
  createdAt,
  updatedAt,
  isActive,
  fragment,
  onFragmentClick,
}: ProjectMessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        type={type}
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        updatedAt={updatedAt}
        isActive={isActive}
        onFragmentClick={onFragmentClick}
      />
    );
  }
  return <UserMessage content={content} />;
};

export default ProjectMessageCard;
