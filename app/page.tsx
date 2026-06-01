"use client"

import React, {useState, useEffect} from "react";
import Link from "next/link";
import Status from "../components/StatusLabels"
import DashboardShell from "../components/DashboardShell";
import { getSupabaseClient } from "../lib/supabase";
import { formatSubmissionDate } from "../lib/submissions";
import { Submission } from "../lib/types";
import { HiOutlineAdjustments } from "react-icons/hi";

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

const STATUS_FILTERS = [
  { label: "Status", value: "all" },
  { label: "Unsubmitted", value: "unsubmitted" },
  { label: "Submitted", value: "submitted" },
  { label: "Published", value: "published" },
];

function applyFilters(
  items: Submission[],
  query: string,
  status: string
) {
  return items.filter((submission) => {
    const matchesSearch =
      query === "" ||
      submission.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus =
      status === "all" ||
      submission.status.trim().toLowerCase() === status;
    return matchesSearch && matchesStatus;
  });
}

function sortByCreated(
  items: Submission[],
  createdSort: "asc" | null
) {
  if (createdSort !== "asc") return items;

  return [...items].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

function getDisplayedSubmissions(
  items: Submission[],
  query: string,
  status: string,
  createdSort: "asc" | null
) {
  return sortByCreated(applyFilters(items, query, status), createdSort);
}

export default function Home() {

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createdSort, setCreatedSort] = useState<"asc" | null>(null)
  const [loading, setLoading] = useState(true)

  function handleSearchFiltering(target: string) {
    setSearchQuery(target)
    setSubmissions(getDisplayedSubmissions(allSubmissions, target, statusFilter, createdSort))
  }

  function handleStatusFiltering(status: string) {
    setStatusFilter(status)
    setSubmissions(getDisplayedSubmissions(allSubmissions, searchQuery, status, createdSort))
  }

  function toggleCreatedSort() {
    const nextSort = createdSort === "asc" ? null : "asc"
    setCreatedSort(nextSort)
    setSubmissions(getDisplayedSubmissions(allSubmissions, searchQuery, statusFilter, nextSort))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from("submissions")
          .select("id, manuscript_number, title, status, created_at, updated_at");
        setSubmissions(getDisplayedSubmissions(data ?? [], searchQuery, statusFilter, createdSort))
        setAllSubmissions(data ?? [])
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <h1 className="title text-primary w-max">
          Dashboard
        </h1>

        <div className="flex items-center gap-3 w-max">
          {searchOpen && (
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearchFiltering(e.target.value)}
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

                <th className="px-4 py-3 font-normal">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFiltering(e.target.value)}
                    className="rounded pl-2 py-1 text-xs bg-gray-50 shadow-inner border border-gray-200 text-slate-700 font-normal"
                    aria-label="Filter by status"
                  >
                    {STATUS_FILTERS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </th>

                <th className="px-4 py-3 font-normal">
                  <button
                    type="button"
                    onClick={toggleCreatedSort}
                    className="flex items-center gap-1.5 uppercase text-xs text-slate-700 hover:text-primary hover:cursor-pointer"
                    aria-label="Sort by created date"
                  >
                    Created
                    <HiOutlineAdjustments
                      className={`w-3.5 h-3.5 ${createdSort === "asc" ? "text-primary" : ""}`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 font-normal">Updated</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div
                      className="inline-block size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                      aria-label="Loading submissions"
                    />
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
