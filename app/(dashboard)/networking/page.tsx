"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/app/types/user";
import { useToast } from "@/hooks/use-toast";
import { Poppins } from "next/font/google";
import { UserPlus, UserMinus, MessageSquare, Users, Network } from "lucide-react";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Mock data for forums and groups
const forumTopics = [
  { id: 1, title: "Latest Advancements in AI", replies: 23, views: 156 },
  { id: 2, title: "Blockchain in Academia", replies: 15, views: 98 },
  { id: 3, title: "The Future of Online Learning", replies: 31, views: 210 },
  { id: 4, title: "Sustainable Energy Research", replies: 42, views: 287 },
  { id: 5, title: "Neuroscience Breakthroughs", replies: 19, views: 134 },
];

const interestGroups = [
  { id: 1, name: "Machine Learning Enthusiasts", members: 1250 },
  { id: 2, name: "Quantum Computing Research", members: 780 },
  { id: 3, name: "Sustainable Technology Innovation", members: 950 },
  { id: 4, name: "Bioinformatics Study Group", members: 620 },
  { id: 5, name: "Space Exploration Society", members: 1100 },
];

export default function AcademicNetworkPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const storedFollowingIds = JSON.parse(
      localStorage.getItem(`following_${storedCurrentUser?.id}`) || "[]",
    );

    setUsers(storedUsers.filter((user: User) => user.id !== storedCurrentUser?.id));
    setCurrentUser(storedCurrentUser);
    setFollowingIds(storedFollowingIds);
  }, []);

  const handleFollow = (userToFollow: User) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to follow users.",
        variant: "destructive",
      });
      return;
    }

    const newFollowingIds = [...followingIds, userToFollow.id];
    setFollowingIds(newFollowingIds);
    localStorage.setItem(`following_${currentUser.id}`, JSON.stringify(newFollowingIds));

    toast({
      title: "Success",
      description: `You are now following ${userToFollow.firstName} ${userToFollow.lastName}.`,
    });
  };

  const handleUnfollow = (userToUnfollow: User) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to unfollow users.",
        variant: "destructive",
      });
      return;
    }

    const newFollowingIds = followingIds.filter((id) => id !== userToUnfollow.id);
    setFollowingIds(newFollowingIds);
    localStorage.setItem(`following_${currentUser.id}`, JSON.stringify(newFollowingIds));

    toast({
      title: "Success",
      description: `You have unfollowed ${userToUnfollow.firstName} ${userToUnfollow.lastName}.`,
    });
  };

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

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, users]);

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full bg-white shadow-lg mb-8">
          <CardHeader className="bg-purple-700 text-white">
            <CardTitle className="text-2xl sm:text-3xl font-bold">Academic Network</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Input
              type="text"
              placeholder="Search forums, groups, and users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-purple-800 flex items-center">
                  <MessageSquare className="mr-2" /> Public Forums
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4">
                  {filteredForums.map((topic) => (
                    <Card
                      key={topic.id}
                      className="bg-white shadow hover:shadow-md transition-shadow mb-4"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {topic.replies} replies · {topic.views} views
                        </p>
                        <Button variant="outline" className="w-full">
                          Join Discussion
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredForums.length === 0 && (
                    <p className="text-gray-500">No matching forums found.</p>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-purple-800 flex items-center">
                  <Users className="mr-2" /> Interest Groups
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4">
                  {filteredGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="bg-white shadow hover:shadow-md transition-shadow mb-4"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{group.members} members</p>
                        <Button variant="outline" className="w-full">
                          Join Group
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredGroups.length === 0 && (
                    <p className="text-gray-500">No matching groups found.</p>
                  )}
                </div>
              </section>

              <section className="space-y-4 md:col-span-2 lg:col-span-1">
                <h2 className="text-2xl font-semibold text-purple-800 flex items-center">
                  <Network className="mr-2" /> Networking
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4">
                  {filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="bg-white shadow hover:shadow-md transition-shadow mb-4"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-bold">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-purple-800">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        {followingIds.includes(user.id) ? (
                          <Button
                            variant="outline"
                            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                            onClick={() => handleUnfollow(user)}
                          >
                            <UserMinus className="mr-2 h-4 w-4" /> Unfollow
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleFollow(user)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" /> Follow
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-gray-500">No matching users found.</p>
                  )}
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
