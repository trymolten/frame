"use client";

import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Fragment } from "@/generated/prisma/client";

import ProjectMessageCard from "@/modules/projects/components/project-message-card";
import ProjectMessageForm from "@/modules/projects/components/project-message-form";
import ProjectMessageLoading from "@/modules/projects/components/project-message-loading";

function hasPendingRun(messages?: { role: "USER" | "ASSISTANT" }[]) {
  if (!messages) return false;
  const users = messages.filter((m) => m.role === "USER").length;
  return users > messages.length - users;
}

interface ProjectMessagesContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment) => void;
}

const ProjectMessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Readonly<ProjectMessagesContainerProps>) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMessages.queryOptions(
      { projectId },
      {
        // Only poll while a run is pending: each run adds exactly one reply,
        // so more user messages than replies means work is queued. Idle
        // editors would otherwise hit the database every few seconds.
        refetchInterval: (query) =>
          hasPendingRun(query.state.data) ? 2000 : false,
      }
    )
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (
      lastAssistantMessage &&
      lastAssistantMessage.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
      setActiveFragment(lastAssistantMessage.fragment);
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    bottomRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages.length]);

  const isBuilding = hasPendingRun(messages);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <ProjectMessageCard
              key={message.id}
              role={message.role}
              type={message.type}
              content={message.content}
              fragment={message.fragment}
              createdAt={message.createdAt}
              updatedAt={message.updatedAt}
              isActive={activeFragment?.id === message.fragment?.id}
              onFragmentClick={setActiveFragment}
            />
          ))}
          {isBuilding && <ProjectMessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none" />
        <ProjectMessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectMessagesContainer;
