"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/app/types/user";
import { useToast } from "@/hooks/use-toast";

export default function FollowingPage() {
  const [following, setFollowing] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(storedCurrentUser);

    if (storedCurrentUser) {
      const followingIds = JSON.parse(
        localStorage.getItem(`following_${storedCurrentUser.id}`) || "[]",
      );
      const followingUsers = storedUsers.filter((user: User) => followingIds.includes(user.id));
      setFollowing(followingUsers);
    }
  }, []);

  const handleUnfollow = (userToUnfollow: User) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to unfollow users.",
        variant: "destructive",
      });
      return;
    }

    const followingIds = JSON.parse(localStorage.getItem(`following_${currentUser.id}`) || "[]");
    const newFollowingIds = followingIds.filter((id: string) => id !== userToUnfollow.id);
    localStorage.setItem(`following_${currentUser.id}`, JSON.stringify(newFollowingIds));

    setFollowing(following.filter((user) => user.id !== userToUnfollow.id));

    toast({
      title: "Success",
      description: `You have unfollowed ${userToUnfollow.firstName} ${userToUnfollow.lastName}.`,
    });
  };

  return (
    <div className="container mx-auto py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">People You're Following</CardTitle>
        </CardHeader>
        <CardContent>
          {following.length === 0 ? (
            <p className="text-center text-gray-500">You're not following anyone yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {following.map((user) => (
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleUnfollow(user)}
                    >
                      Unfollow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
