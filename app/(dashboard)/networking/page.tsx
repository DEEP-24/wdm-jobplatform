"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquareIcon, Network, UserMinus, UserPlus, Users } from "lucide-react";
import { Poppins } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

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

type User = {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
  following?: User[];
  followers?: User[];
  isFollowingMe?: boolean;
};

export default function AcademicNetworkPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get current user
        const currentUserResponse = await fetch("/api/auth/check");
        const currentUserData = await currentUserResponse.json();

        if (!currentUserData.authenticated) {
          toast({
            title: "Error",
            description: "You must be logged in to view the network.",
            variant: "destructive",
          });
          return;
        }

        setCurrentUser(currentUserData.user);

        // Get all users except current user
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();

        if (!usersData.users) {
          throw new Error("Failed to fetch users data");
        }

        // Get followers
        const followersResponse = await fetch("/api/users/followers");
        const followersData = await followersResponse.json();

        const followerIds =
          followersData.followers?.map((follow: { followerId: string }) => follow.followerId) || [];

        // Get following users
        const followingResponse = await fetch("/api/users/following");
        const followingData = await followingResponse.json();

        console.log("Following data:", followingData); // Debug log

        // Set following IDs
        const followingIds =
          followingData.following?.map((follow: { followingId: string }) => follow.followingId) ||
          [];

        setFollowingIds(followingIds);

        // Filter out the current user and add isFollowingMe flag
        const filteredUsers = usersData.users
          .filter((user: User) => user.id !== currentUserData.user.id)
          .map((user: User) => ({
            ...user,
            isFollowingMe: followerIds.includes(user.id),
          }));

        setUsers(filteredUsers);
      } catch (err: unknown) {
        console.error("Error fetching users:", err);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const handleFollow = async (userToFollow: User) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to follow users.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/users/${userToFollow.id}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId: currentUser.id }),
      });

      if (!response.ok) {
        // Handle non-JSON errors
        const text = await response.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.message || "Failed to follow user");
        } catch (_e) {
          throw new Error(text || "Failed to follow user");
        }
      }

      // Update followingIds state
      const newFollowingIds = [...followingIds, userToFollow.id];
      console.log("Updated following IDs after follow:", newFollowingIds);
      setFollowingIds(newFollowingIds);

      const name = userToFollow.profile
        ? `${userToFollow.profile.firstName} ${userToFollow.profile.lastName}`
        : userToFollow.email;

      toast({
        title: "Success",
        description: `You are now following ${name}.`,
      });
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to follow user",
        variant: "destructive",
      });
    }
  };

  const handleUnfollow = async (userToUnfollow: User) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to unfollow users.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/users/${userToUnfollow.id}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId: currentUser.id }),
      });

      if (!response.ok) {
        // Handle non-JSON errors
        const text = await response.text();
        try {
          const error = JSON.parse(text);
          throw new Error(error.message || "Failed to unfollow user");
        } catch (_e) {
          throw new Error(text || "Failed to unfollow user");
        }
      }

      // Update local state
      const newFollowingIds = followingIds.filter((id) => id !== userToUnfollow.id);
      console.log("Updated following IDs after unfollow:", newFollowingIds);
      setFollowingIds(newFollowingIds);

      const name = userToUnfollow.profile
        ? `${userToUnfollow.profile.firstName} ${userToUnfollow.profile.lastName}`
        : userToUnfollow.email;

      toast({
        title: "Success",
        description: `You have unfollowed ${name}.`,
      });
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to unfollow user",
        variant: "destructive",
      });
    }
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
    return users.filter((user) => {
      const searchString = searchTerm.toLowerCase();
      const firstName = user.profile?.firstName?.toLowerCase() || "";
      const lastName = user.profile?.lastName?.toLowerCase() || "";
      const email = user.email.toLowerCase();

      return (
        firstName.includes(searchString) ||
        lastName.includes(searchString) ||
        email.includes(searchString)
      );
    });
  }, [searchTerm, users]);

  console.log("Current followingIds state:", followingIds); // Debug log

  console.log("Current user:", currentUser);
  console.log("Following IDs:", followingIds);
  console.log("Filtered Users:", filteredUsers);

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
                  <MessageSquareIcon className="mr-2" /> Public Forums
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
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${
                                user.profile
                                  ? `${user.profile.firstName} ${user.profile.lastName}`
                                  : user.email
                              }`}
                            />
                            <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-bold">
                              {user.profile
                                ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
                                : user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-purple-800">
                              {user.profile
                                ? `${user.profile.firstName} ${user.profile.lastName}`
                                : user.email}
                            </h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.isFollowingMe && (
                              <p className="text-sm text-purple-600 mt-1">Following you</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
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
                        </div>
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
