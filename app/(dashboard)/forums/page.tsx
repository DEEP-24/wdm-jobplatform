"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for forums and groups
const forumTopics = [
  { id: 1, title: "Latest Advancements in AI", replies: 23, views: 156 },
  { id: 2, title: "Blockchain in Academia", replies: 15, views: 98 },
  { id: 3, title: "The Future of Online Learning", replies: 31, views: 210 },
];

const interestGroups = [
  { id: 1, name: "Machine Learning Enthusiasts", members: 1250 },
  { id: 2, name: "Quantum Computing Research", members: 780 },
  { id: 3, name: "Sustainable Technology Innovation", members: 950 },
];

export default function ForumsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter forums based on search term
  const filteredForums = useMemo(() => {
    return forumTopics.filter((topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    return interestGroups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <Card className="bg-white text-black border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Academic Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Engage in thought-provoking discussions, share ideas, and collaborate with peers and
            experts.
          </p>
          <Input
            type="text"
            placeholder="Search forums and groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Tabs defaultValue="forums">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forums">Public Forums</TabsTrigger>
              <TabsTrigger value="groups">Interest Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="forums">
              <div className="space-y-4">
                {filteredForums.map((topic) => (
                  <Card key={topic.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{topic.title}</h3>
                        <p className="text-sm text-gray-500">
                          {topic.replies} replies · {topic.views} views
                        </p>
                      </div>
                      <Button variant="outline">Join Discussion</Button>
                    </CardContent>
                  </Card>
                ))}
                {filteredForums.length === 0 && (
                  <p className="text-gray-500">No matching forums found.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="groups">
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.members} members</p>
                      </div>
                      <Button variant="outline">Join Group</Button>
                    </CardContent>
                  </Card>
                ))}
                {filteredGroups.length === 0 && (
                  <p className="text-gray-500">No matching groups found.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
