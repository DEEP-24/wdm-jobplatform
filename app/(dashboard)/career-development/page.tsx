import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CareerDevelopmentPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Career Development</h1>

      <Card>
        <CardHeader>
          <CardTitle>Career Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Resume Writing Tips</li>
            <li>Interview Preparation Guide</li>
            <li>Networking Strategies</li>
            <li>Professional Development Workshops</li>
            <li>Career Assessment Tools</li>
            <li>Salary Negotiation Techniques</li>
          </ul>
          <Button className="mt-4">Explore Resources</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentorship Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect with experienced mentors in your field for career guidance and support.</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>One-on-one mentoring sessions</li>
            <li>Mentor matching based on career goals</li>
            <li>Structured mentorship programs</li>
            <li>Peer mentoring opportunities</li>
          </ul>
          <Button className="mt-4" asChild>
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Articles and Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Top 10 Skills Employers Are Looking For</li>
            <li>How to Build a Strong Professional Network</li>
            <li>Navigating Your Academic Career Path</li>
            <li>Balancing Research and Professional Development</li>
            <li>Effective Time Management for Career Success</li>
            <li>Developing Leadership Skills in Academia</li>
          </ul>
          <Button className="mt-4">Read More</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Growth Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal SWOT Analysis Template</li>
            <li>Goal Setting Worksheets</li>
            <li>Career Path Mapping Tool</li>
            <li>Skills Gap Analysis</li>
            <li>Professional Development Plan Creator</li>
          </ul>
          <Button className="mt-4">Access Tools</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerDevelopmentPage;
