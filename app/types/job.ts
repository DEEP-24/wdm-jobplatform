export type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  fullDescription: string;
  salary: string;
  postedAgo: string;
  workMode: "onsite" | "remote" | "hybrid";
  type: "job" | "internship";
};
