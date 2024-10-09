export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  salary: string;
  postedAgo: string;
  fullDescription: string;
  jobType: "onsite" | "remote" | "hybrid";
}
