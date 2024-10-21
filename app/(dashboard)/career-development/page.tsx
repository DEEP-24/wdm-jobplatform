import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CareerDevelopmentPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-800">Career Development</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl">Career Resources</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Resume Writing Tips</li>
              <li>Interview Preparation Guide</li>
              <li>Networking Strategies</li>
              <li>Professional Development Workshops</li>
              <li>Career Assessment Tools</li>
              <li>Salary Negotiation Techniques</li>
            </ul>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
              Explore Resources
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl">Mentorship Program</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              Connect with experienced mentors in your field for career guidance and support.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>One-on-one mentoring sessions</li>
              <li>Mentor matching based on career goals</li>
              <li>Structured mentorship programs</li>
              <li>Peer mentoring opportunities</li>
            </ul>
            <Button
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
              asChild
            >
              <Link href="/mentors">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl">Career Articles and Tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Top 10 Skills Employers Are Looking For</li>
              <li>How to Build a Strong Professional Network</li>
              <li>Navigating Your Academic Career Path</li>
              <li>Balancing Research and Professional Development</li>
              <li>Effective Time Management for Career Success</li>
              <li>Developing Leadership Skills in Academia</li>
            </ul>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
              Read More
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl">Career Growth Tools</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Personal SWOT Analysis Template</li>
              <li>Goal Setting Worksheets</li>
              <li>Career Path Mapping Tool</li>
              <li>Skills Gap Analysis</li>
              <li>Professional Development Plan Creator</li>
            </ul>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
              Access Tools
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerDevelopmentPage;
