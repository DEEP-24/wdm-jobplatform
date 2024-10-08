"use client";

import { PageHeading } from "@/app/(dashboard)/_components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

// Mock data for jobs
const jobsData = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "Google",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$140k/yr",
    postedAgo: "5 hours ago",
    fullDescription:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX and all the major web related technologies. It will be an onsite job. You will work on both frontend and backend technologies, collaborating with cross-functional teams to deliver high-quality solutions. Proficiency in JavaScript, HTML/CSS, and frameworks like React, Angular, or Vue.js is essential. Backend experience in Node.js, Python, or similar, along with database knowledge (SQL/NoSQL), is required. The ideal candidate has experience with version control (Git), cloud services, and a passion for writing clean, efficient code. Strong problem-solving skills and attention to detail are key.",
    jobType: "onsite",
  },
  {
    id: 2,
    title: "UI/UX Developer",
    company: "BCBS",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$140k/yr",
    postedAgo: "15 days ago",
    fullDescription:
      "We are seeking a talented UI/UX Developer to join our team. This role involves creating intuitive and engaging user interfaces for web and mobile applications. Responsibilities include designing wireframes, creating mockups, and collaborating with developers to implement designs. Strong visual design skills with sensitivity to user-system interaction are essential. Proficiency in design tools like Adobe XD, Figma, or Sketch is required. Experience with responsive design and cross-browser compatibility is a plus. The ideal candidate has a keen eye for aesthetics, attention to detail, and a passion for creating user-friendly designs.",
    jobType: "remote",
  },
  {
    id: 3,
    title: "Web Developer Intern",
    company: "ElderCareConnect Inc.",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    postedAgo: "1 month ago",
    salary: "$100k/yr",
    fullDescription:
      "We are offering an exciting internship opportunity for a Web Developer. This is a great opportunity to gain hands-on experience and learn from industry experts. The ideal candidate is a quick learner, has a strong work ethic, and is passionate about web development. Responsibilities include coding, debugging, and testing web applications. Proficiency in HTML, CSS, JavaScript, and React is required. Basic knowledge of web server technologies like Node.js or PHP is a plus. The candidate should be able to work independently and as part of a team, with excellent communication skills.",
    jobType: "hybrid",
  },
  {
    id: 4,
    title: "React Developer",
    company: "meta",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$200k/yr",
    postedAgo: "3 months ago",
    fullDescription:
      "Join our team as a React Developer and work on cutting-edge projects. You will be responsible for developing and maintaining web applications using React.js. Proficiency in JavaScript, HTML/CSS, and React.js is essential. Experience with state management, RESTful APIs, and version control (Git) is required. Strong problem-solving skills and attention to detail are key. The ideal candidate has a passion for web development and a commitment to delivering high-quality code.",
    jobType: "remote",
  },
  {
    id: 5,
    title: "Web Developer",
    company: "IBM",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX.",
    salary: "$140k/yr",
    postedAgo: "4 months ago",
    fullDescription:
      "IBM is seeking a Web Developer to join our innovative team. The ideal candidate will have a strong foundation in web technologies and a passion for creating robust, scalable web applications. You'll be working on cutting-edge projects, collaborating with cross-functional teams to deliver high-quality solutions. Proficiency in HTML, CSS, JavaScript, and modern frameworks like React or Angular is essential. Experience with server-side technologies such as Node.js, Python, or Java is a plus. The role involves developing and maintaining web applications, optimizing performance, and ensuring cross-browser compatibility. Strong problem-solving skills, attention to detail, and the ability to work in an agile environment are crucial. Join IBM and be part of shaping the future of web technology!",
    jobType: "onsite",
  },
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(jobsData[0]);
  const [showJobList, setShowJobList] = useState(true);

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Job listings */}
      <div
        className={`w-full md:w-1/3 border-r border-gray-200 overflow-hidden ${
          showJobList ? "block" : "hidden md:block"
        }`}
      >
        <ScrollArea className="h-full pr-4 [&>div]:!overflow-x-hidden [&>div>div]:!mr-0">
          {jobsData.map((job) => (
            <Card
              key={job.id}
              className={`m-2 cursor-pointer ${selectedJob.id === job.id ? "border-black" : ""}`}
              onClick={() => {
                setSelectedJob(job);
                setShowJobList(false);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.company}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                {job.salary && (
                  <Badge variant="default" className="mr-2 mb-2 bg-gray-800 text-white">
                    {job.salary}
                  </Badge>
                )}
                <span className="text-xs text-gray-500">{job.postedAgo}</span>
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Job details */}
      <div
        className={`w-full md:w-2/3 p-6 overflow-auto ${showJobList ? "hidden md:block" : "block"}`}
      >
        <Button variant="outline" className="mb-4 md:hidden" onClick={() => setShowJobList(true)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
          <p className="text-lg text-gray-600">{selectedJob.company}</p>
          <div className="flex flex-wrap items-center mt-2">
            <Badge variant="outline" className="mr-2 mb-2">
              {selectedJob.salary || "Salary not specified"}
            </Badge>
            <Badge variant="outline" className="mr-2 mb-2 bg-gray-100">
              {selectedJob.jobType}
            </Badge>
            <span className="text-sm text-gray-500">{selectedJob.postedAgo}</span>
          </div>
        </div>
        <p className="text-gray-700 mb-6">{selectedJob.fullDescription}</p>
        <div className="flex items-center">
          <Button className="mr-4 bg-black text-white hover:bg-gray-800">Apply</Button>
          <Button variant="outline">Save</Button>
        </div>
      </div>
    </div>
  );
}
