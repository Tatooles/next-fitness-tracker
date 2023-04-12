export default function Profile() {
  return (
    <div className="flex flex-col items-center p-5">
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-slate-700">
        <svg
          className="absolute -left-4 h-36 w-36 text-slate-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <div className="my-5 text-lg">Welcome to the profile page</div>
      <div className="flex w-full flex-col gap-2 border-2 border-slate-700 p-5">
        <h2 className="text-md">Name:</h2>
        <h2 className="text-md">Username:</h2>
        <button className="rounded-md bg-slate-700 p-2 text-white">
          Update Profile Picture
        </button>
        <button className="rounded-md bg-slate-700 p-2 text-white">
          Reset Password
        </button>
      </div>
    </div>
  );
}
