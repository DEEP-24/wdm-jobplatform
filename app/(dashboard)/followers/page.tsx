"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/app/types/user";

export default function FollowersPage() {
  const [followers, setFollowers] = useState<User[]>([]);
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(storedCurrentUser);

    if (storedCurrentUser) {
      const followerUsers = storedUsers.filter((user: User) => {
        const following = JSON.parse(localStorage.getItem(`following_${user.id}`) || "[]");
        return following.includes(storedCurrentUser.id);
      });
      setFollowers(followerUsers);
    }
  }, []);

  return (
    <div className="container mx-auto py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Followers</CardTitle>
        </CardHeader>
        <CardContent>
          {followers.length === 0 ? (
            <p className="text-center text-gray-500">You don't have any followers yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map((follower) => (
                <Card key={follower.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${follower.firstName} ${follower.lastName}`}
                        />
                        <AvatarFallback>
                          {follower.firstName[0]}
                          {follower.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {follower.firstName} {follower.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{follower.email}</p>
                      </div>
                    </div>
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
