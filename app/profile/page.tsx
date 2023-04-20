import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Profile() {
  return (
    <div className="flex flex-col items-center p-5">
      <Avatar className="h-28 w-28">
        <AvatarImage src="https://github.com/tatooles.png" />
        <AvatarFallback>KT</AvatarFallback>
      </Avatar>
      <div className="my-5 text-lg">Welcome to the profile page</div>
      <div className="flex w-full flex-col gap-2 border-2 p-5">
        <Label className="text-md">Name:</Label>
        <Label className="text-md">Username:</Label>
        <Button>Update Profile Picture</Button>
        <Button>Reset Password</Button>
      </div>
    </div>
  );
}
