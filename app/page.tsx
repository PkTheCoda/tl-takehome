"use client"

import React, {useState, useEffect} from "react";
import Link from "next/link";
import Status from "../components/StatusLabels"
import DashboardShell from "../components/DashboardShell";
import { getSupabaseClient } from "../lib/supabase";
import { formatSubmissionDate } from "../lib/submissions";
import { Submission } from "../lib/types";

import { BiChevronDown } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

const formatDate = (date: string) => {
  const { datePart, timePart } = formatSubmissionDate(date);
  return (
    <div>
      {datePart} <br /> at {timePart}
    </div>
  );
};

export default function Home() {

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: submissions } = await supabase
          .from("submissions")
          .select("id, manuscript_number, title, status, created_at, updated_at");
        setSubmissions(submissions ?? [])
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardShell>
      <div className="flex gap-x-4 items-center justify-between">
        <h1 className="title text-primary w-max">
          Dashboard
        </h1>

        <div className="flex items-center gap-3 w-max">
          {searchOpen && (
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-md border border-primary bg-white shadow-md outline-none placeholder:text-gray-400"
            />
          )}
          <div className={`flex items-center gap-3 ${searchOpen ? "" : "ml-auto"}`}>
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex items-center justify-center size-10 rounded-full bg-primary text-white shadow-md shrink-0 hover:opacity-90"
              aria-label="Toggle search"
            >
              <FiSearch className="w-5 h-5" />
            </button>
            <Link
              href="/new"
              className="px-5 py-2.5 rounded-md bg-primary text-white shadow-md hover:opacity-90 whitespace-nowrap"
            >
              + New submission
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white w-full shadow-2xl h-full flex flex-col gap-y-4">
        <div className="flex items-center justify-between w-full p-8">
          <h2 className="subheading">
            Your Submissions
          </h2>
          <BiChevronDown />
        </div>

        <div className="overflow-x-auto shadow-lg">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 font-normal">Manuscript #</th>
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Created</th>
                <th className="px-4 py-3 font-normal">Updated</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="bg-white border-t border-gray-100">
                  <td className="px-4 py-3">{submission.manuscript_number}</td>
                  <td className="px-4 py-3">{submission.title}</td>
                  <td className="px-4 py-3"><Status status={submission.status} /></td>
                  <td className="px-4 py-3">{formatDate(submission.created_at)}</td>
                  <td className="px-4 py-3">{formatDate(submission.updated_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/edit/${submission.id}`}
                      className="inline-block px-6 py-2 bg-primary rounded-md text-xs text-white font-normal uppercase"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
