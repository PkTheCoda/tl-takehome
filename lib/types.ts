export type Author = {
  authorName: string;
  affiliation: string;
};

export type Submission = {
  id: number;
  manuscript_number: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  author?: Author[] | null;
};
