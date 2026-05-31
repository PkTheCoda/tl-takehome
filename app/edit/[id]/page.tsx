"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardShell from "../../../components/DashboardShell";
import SubmissionForm, { emptyForm } from "../../../components/SubmissionForm";
import { getSupabaseClient } from "../../../lib/supabase";

export default function EditSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("submissions")
          .select("title, status, updated_at, created_at, author, abstract")
          .eq("id", id)
          .maybeSingle();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        setForm({
          ...emptyForm(),
          title: data.title ?? "",
          status: data.status ?? "",
          updated_at: data.updated_at ?? data.created_at ?? "",
          abstract: data.abstract ?? "",
          authors:
            Array.isArray(data.author) && data.author.length > 0
              ? data.author
              : [{ authorName: "", affiliation: "" }],
        });
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const save = async (submit: boolean) => {
    setSaving(true);
    setSaveError(null);

    try {
      const supabase = getSupabaseClient();
      const updated_at = new Date().toISOString();
      const status = submit ? "Submitted" : "Unsubmitted";

      const { data, error } = await supabase
        .from("submissions")
        .update({ title: form.title, author: form.authors, status, updated_at, abstract: form.abstract })
        .eq("id", id)
        .select("id");

      if (error) throw error;
      if (!data?.length) {
        throw new Error("Nothing was updated. Add an UPDATE policy in Supabase RLS.");
      }

      if (submit) {
        router.push("/");
      } else {
        setForm((prev) => ({ ...prev, status, updated_at }));
      }
    } catch (error) {
      setSaveError(
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <p>Loading submission...</p>
      </DashboardShell>
    );
  }

  if (notFound) {
    return (
      <DashboardShell>
        <p>Submission not found.</p>
        <Link href="/" className="text-primary font-semibold">
          Back to Dashboard
        </Link>
      </DashboardShell>
    );
  }

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
