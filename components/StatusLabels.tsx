
import React from "react";

type StatusLabelsProps = {
  status: string;
};

export default function StatusLabels({ status }: StatusLabelsProps) {
  // Normalize status input for matching
  const statusKey = status.trim().toLowerCase();

  if (statusKey === "published") {
    return (
      <div
        className="bg-success text-white font-bold text-xs rounded-lg px-4 py-2 flex items-center justify-center w-max"
        style={{ letterSpacing: "0.5px" }}
      >
        PUBLISHED
      </div>
    );
  }

  if (statusKey === "submitted") {
    return (
      <div
        className="bg-primary text-white font-bold text-xs rounded-lg px-4 py-2 flex items-center justify-center w-max"
        style={{ letterSpacing: "0.5px" }}
      >
        SUBMITTED
      </div>
    );
  }

  if (statusKey === "unsubmitted") {
    return (
      <div
        className="bg-secondary text-gray-900 font-bold text-xs rounded-lg px-4 py-2 flex items-center justify-center w-max"
        style={{ letterSpacing: "0.5px" }}
      >
        UNSUBMITTED
      </div>
    );
  }

  // Fallback/default
  return (
    <div
      className="bg-gray-300 text-black font-bold text-xs rounded-lg px-4 py-2 flex items-center justify-center w-max"
      style={{ letterSpacing: "0.5px" }}
    >
      {statusKey.toUpperCase()}
    </div>
  );
}