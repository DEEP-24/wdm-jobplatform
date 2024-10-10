"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/app/types/user";
import { useToast } from "@/hooks/use-toast";

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

    // Filter out the current user from the list of users
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
    <div className="container mx-auto py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Networking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="flex flex-col justify-between">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  {followingIds.includes(user.id) ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleUnfollow(user)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleFollow(user)}>
                      Follow
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
