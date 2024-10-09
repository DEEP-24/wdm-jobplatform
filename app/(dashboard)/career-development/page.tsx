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
          <Button className="mt-4" asChild>
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Top 10 Skills Employers Are Looking For</li>
            <li>How to Build a Strong Professional Network</li>
            <li>Navigating Your Academic Career Path</li>
            <li>Balancing Research and Professional Development</li>
          </ul>
          <Button className="mt-4">Read More</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerDevelopmentPage;
