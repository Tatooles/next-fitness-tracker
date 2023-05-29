import { SignIn } from "@clerk/nextjs/app-beta";

export default function Page() {
  return (
    <div className="flex justify-center">
      <SignIn signUpUrl="/sign-up" redirectUrl={"/home"} />
      {/* TODO: I think this redirectUrl is a relative path, may need to be absolute */}
    </div>
  );
}
