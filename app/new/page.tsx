"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import SubmissionForm, { emptyForm } from "../../components/SubmissionForm";
import { getSupabaseClient } from "../../lib/supabase";

export default function NewSubmissionPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const save = async (submit: boolean) => {
    setSaving(true);
    setSaveError(null);

    try {
      const supabase = getSupabaseClient();
      const now = new Date().toISOString();

      const { data: latest } = await supabase
        .from("submissions")
        .select("manuscript_number")
        .order("manuscript_number", { ascending: false })
        .limit(1);

      // add 1 to the latest manuscript number, alwaus incrementing
      const manuscript_number = (latest?.[0]?.manuscript_number ?? 0) + 1;

      // inesrt data in
      const { data, error } = await supabase
        .from("submissions")
        .insert({
          title: form.title,
          author: form.authors,
          manuscript_number,
          status: submit ? "Submitted" : "Unsubmitted",
          created_at: now,
          updated_at: now,
        })
        .select("id");

        // error handling
      if (error) throw error;
      if (!data?.length) {
        throw new Error("Nothing was created. Add an INSERT policy in Supabase RLS.");
      }

      // once submitted, go back to homepage, else, set status to unsubmitted, change updated_at
      if (submit) {
        router.push("/");
      } else {
        setForm((prev) => ({
          ...prev,
          status: "Unsubmitted",
          updated_at: now,
        }));
      }
    } catch (error) {
      // error handling on frontend
      setSaveError(
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell>
      <SubmissionForm
        form={form}
        setForm={setForm}
        saving={saving}
        saveError={saveError}
        onSaveDraft={() => save(false)}
        onSubmit={() => save(true)}
      />
    </DashboardShell>
  );
}
