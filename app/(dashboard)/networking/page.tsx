"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/app/types/user";
import { useToast } from "@/hooks/use-toast";
import { Poppins } from "next/font/google";
import { UserPlus, UserMinus } from "lucide-react";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function NetworkingPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
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

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl sm:text-3xl font-bold">Networking</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="flex flex-col justify-between bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
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
                  </CardContent>
                  <CardContent className="pt-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
