import { SignIn } from "@clerk/nextjs/app-beta";

export default function Page() {
  return (
    <div className="flex justify-center">
      <SignIn signUpUrl="/sign-up" redirectUrl={"www.liftinglog.app/home"} />
      {/* TODO: I think this redirectUrl is a relative path, needs to be absolute */}
    </div>
  );
}
