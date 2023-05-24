import { SignIn } from "@clerk/nextjs/app-beta";

export default function Page() {
  return (
    <div className="flex justify-center">
      <SignIn signUpUrl="/sign-up" redirectUrl={"/home"} />
    </div>
  );
}
