"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-5">
      <Avatar className="h-28 w-28">
        {/* <AvatarImage src="https://github.com/tatooles.png" /> */}
        <AvatarFallback>
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="my-5 text-lg">Welcome to the profile page</div>
      <div className="flex w-full flex-col gap-2 border-2 p-5">
        {/* TODO: Make these fields conditional based on if the field exists */}
        <Label className="text-md">Name: {user.fullName}</Label>
        <Label className="text-md">Username: {user.username}</Label>
        <Label className="text-md">
          Email Address: {user.primaryEmailAddress?.toString()}
        </Label>
        <Button>Update Profile Picture</Button>
        <Button>Reset Password</Button>
      </div>
    </div>
  );
}
