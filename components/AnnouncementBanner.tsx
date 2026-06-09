"use client";

import { useState } from "react";
import { X, CheckCircle2, Dumbbell } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

function BannerContent({
  message,
  type = "info",
}: {
  message: string;
  type?: "info" | "success";
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Styling dinamis berdasarkan tipe banner
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10",
    info: "bg-white border-gray-200 text-slate-800 shadow-black/5",
  };

  const currentStyle = styles[type];

  return (
    <div className="absolute left-0 top-0 z-50 flex w-full justify-center px-4 py-4">
      <div
        className={`flex w-[90%] max-w-[420px] items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all sm:items-center ${currentStyle}`}
      >
        {/* Render Icon berdasarkan tipe */}
        {type === "success" ? (
          <div className="mt-0.5 shrink-0 rounded-full bg-emerald-100 p-1.5 text-emerald-600 sm:mt-0">
            <CheckCircle2 className="size-4" />
          </div>
        ) : (
          <div className="mt-0.5 shrink-0 rounded-full bg-blue-100 p-1.5 text-blue-600 sm:mt-0">
            <Dumbbell className="size-4" />
          </div>
        )}

        <p className="mr-2 flex-1 text-sm font-medium leading-relaxed">
          {message}
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="mt-0.5 shrink-0 rounded-full p-1 text-inherit opacity-70 transition-colors hover:bg-black/5 hover:opacity-100 sm:mt-0"
          aria-label="Dismiss banner"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

const AnnouncementBanner = () => {
  const isEnabled = process.env.NEXT_PUBLIC_BANNER_ENABLED === "true";
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!isEnabled) return null;

  if (pathname === "/") {
    return (
      <BannerContent
        key="home"
        message="👋 Selamat datang di Lifting Log! Catat dan pantau progres latihan kamu di sini."
        type="info"
      />
    );
  }

  if (pathname === "/workouts" && searchParams.get("created") === "true") {
    return (
      <BannerContent
        key="workout-created"
        message="Workout berhasil ditambahkan! Terus semangat latihan."
        type="success"
      />
    );
  }

  return null;
};

export default AnnouncementBanner;