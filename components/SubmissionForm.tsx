import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import Status from "./StatusLabels";
import { formatVersionLabel } from "../lib/submissions";
import { Author } from "../lib/types";

const RESEARCH_TYPES = ["Software", "Dataset", "Workflow", "Publication", "Other"];

export type FormState = {
  title: string;
  status: string;
  updated_at: string;
  research_object_type: string;
  doi: string;
  abstract: string;
  authors: Author[];
};

// store an empty form -- used for /NEW pages
export const emptyForm = (): FormState => ({
  title: "",
  status: "Unsubmitted",
  updated_at: new Date().toISOString(),
  research_object_type: "Software",
  doi: "",
  abstract: "",
  authors: [{ authorName: "", affiliation: "" }],
});

// props for submission
type SubmissionFormProps = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  saving: boolean;
  saveError: string | null;
  onSaveDraft: () => void;
  onSubmit: () => void;
};

export default function SubmissionForm({
  form,
  setForm,
  saving,
  saveError,
  onSaveDraft,
  onSubmit,
}: SubmissionFormProps) {
  return (
    <div className="w-full flex flex-col">

      <div className="flex items-center justify-between pt-8 pb-4">
        <select className="text-sm ">
          <option>
            <span className="text-red-400 text-2xl">Version 1 - </span>
            {formatVersionLabel(form.updated_at)}
          </option>
        </select>
        <Status status={form.status} />
      </div>

      <div className="bg-white py-8 shadow-2xl">
        <div className="px-8 pb-4 border-b border-gray-200">
          <h1 className="heading mb-2">Research Object Submission Form</h1>
          <p className="text-gray-500">
            Please fill out the form below to complete your submission.
          </p>
        </div>
        <form className="px-8 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="label">Type of Research Object</label>
            <select
              value={form.research_object_type}
              onChange={(e) =>
                setForm({ ...form, research_object_type: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50"
            >
              {RESEARCH_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="label text-lg">Add Co-Authors</h2>
            {form.authors.map((author, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Author name</label>
                  <input
                    type="text"
                    value={author.authorName}
                    onChange={(e) => {
                      const authors = [...form.authors];
                      authors[index] = { ...author, authorName: e.target.value };
                      setForm({ ...form, authors });
                    }}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Affiliation</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={author.affiliation}
                      onChange={(e) => {
                        const authors = [...form.authors];
                        authors[index] = { ...author, affiliation: e.target.value };
                        setForm({ ...form, authors });
                      }}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (form.authors.length === 1) return;
                        setForm({
                          ...form,
                          authors: form.authors.filter((_, i) => i !== index),
                        });
                      }}
                      className="flex items-center justify-center size-8 rounded-full bg-primary text-white shrink-0"
                      aria-label="Remove co-author"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  authors: [...form.authors, { authorName: "", affiliation: "" }],
                })
              }
              className="text-primary font-semibold text-left w-max"
            >
              + Add another person
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">DOI</label>
            <input
              type="text"
              value={form.doi}
              onChange={(e) => setForm({ ...form, doi: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">Abstract</label>
            <textarea
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 resize-y bg-gray-50"
            />
            <p className="detail text-sm text-gray-500">
              Please provide a short summary of your submission
            </p>
          </div>
          {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              disabled={saving}
              onClick={onSaveDraft}
              className="px-8 py-2.5 rounded-md border border-gray-300 text-gray-600 bg-white disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onSubmit}
              className="px-8 py-2.5 rounded-md bg-primary text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
