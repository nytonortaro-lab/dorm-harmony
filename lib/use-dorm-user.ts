"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  normalizeDormMetadata,
  type DormUserMetadata,
  type SerializedAppUser,
} from "@/lib/dorm-data";

type SaveResult = {
  ok: boolean;
  message?: string;
};

export function useDormUser(initialUser: SerializedAppUser) {
  const [supabase] = useState(() => createClient());
  const [metadata, setMetadata] = useState(() =>
    normalizeDormMetadata(initialUser.metadata, initialUser.email)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveMetadata(
    patch: Partial<DormUserMetadata>,
    successMessage?: string
  ): Promise<SaveResult> {
    setIsSaving(true);
    setMessage("");

    const previous = metadata;

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      const remote = normalizeDormMetadata(
        (currentUser?.user_metadata ?? previous) as Record<string, unknown>,
        initialUser.email
      );

      const nextMetadata: DormUserMetadata = {
        ...remote,
        ...patch,
        dormProfile: patch.dormProfile ?? remote.dormProfile,
        habitSurvey: patch.habitSurvey ?? remote.habitSurvey,
        customQuestions: patch.customQuestions ?? remote.customQuestions,
        joinedPool: patch.joinedPool ?? remote.joinedPool,
        lastJoinedAt: patch.lastJoinedAt ?? remote.lastJoinedAt,
      };

      const { data, error } = await supabase.auth.updateUser({
        data: nextMetadata,
      });

      if (error) {
        setMetadata(previous);
        setMessage(error.message);
        setIsSaving(false);
        return {
          ok: false,
          message: error.message,
        };
      }

      const normalized = normalizeDormMetadata(
        (data.user?.user_metadata ?? nextMetadata) as Record<string, unknown>,
        initialUser.email
      );

      setMetadata(normalized);
      setMessage(successMessage ?? "");
      setIsSaving(false);

      return {
        ok: true,
        message: successMessage,
      };
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to update user metadata.";
      setMetadata(previous);
      setMessage(text);
      setIsSaving(false);
      return {
        ok: false,
        message: text,
      };
    }
  }

  return {
    userId: initialUser.id,
    email: initialUser.email,
    metadata,
    isSaving,
    message,
    setMessage,
    setMetadata,
    saveMetadata,
  };
}
