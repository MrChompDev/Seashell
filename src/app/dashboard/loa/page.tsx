import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { LoaRequest } from "@/lib/types";
import { LoaClient, LoaWithdraw } from "@/components/loa-client";

export default async function LoaPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/staff?reason=signin");
  }

  const { data, error } = await supabase
    .from("loa_requests")
    .select("*")
    .eq("requested_by", userData.user.id)
    .order("created_at", { ascending: false });

  const myRequests = (data ?? []) as LoaRequest[];

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow text-copper-300">Time & Attendance</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-cream sm:text-4xl">
            LOA Requests
          </h1>
          <div className="flex gap-2">
            <Link href="/dashboard" className="btn-outline text-sm">
              <ArrowLeft className="h-4 w-4" />
              Overview
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
          Need an extended absence? Submit a Leave of Absence request to the
          staff team. Members of the Admin team can review and respond here.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card-dark p-7 lg:col-span-2">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-copper-300" />
            <h2 className="text-lg font-semibold text-cream">Submit New LOA</h2>
          </div>
          <LoaClient />
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-cream">
            My Requests
            <span className="ml-3 text-xs font-normal text-stone-500">
              Withdrawal only removes the request on your side.
            </span>
          </h2>
          {error ? (
            <p className="card-dark p-8 text-center text-sm text-red-300">
              Couldn't load your requests: {error.message}
            </p>
          ) : myRequests.length === 0 ? (
            <div className="card-dark flex flex-col items-center gap-3 p-12 text-center">
              <CalendarClock className="h-8 w-8 text-copper-300/70" />
              <p className="text-sm text-stone-400">No LOA requests yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {myRequests.map((r) => (
                <li key={r.id} className="card-dark p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-stone-500">
                        From
                      </p>
                      <p className="mt-1 text-sm font-medium text-cream">
                        {new Date(r.start_date + "T00:00:00").toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-stone-500">
                        To
                      </p>
                      <p className="mt-1 text-sm font-medium text-cream">
                        {new Date(r.end_date + "T00:00:00").toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-stone-500">
                        Type
                      </p>
                      <p className="mt-1 text-sm font-medium text-cream">{r.type ?? "Other"}</p>
                    </div>
                  </div>
                  {r.reason && (
                    <p className="mt-4 rounded-lg border border-white/5 bg-ink/60 px-4 py-3 text-sm text-stone-400">
                      {r.reason}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-stone-500">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                    <span
                      className={
                        "rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider " +
                        (r.status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : r.status === "Denied"
                            ? "bg-red-500/15 text-red-300"
                            : "bg-amber-500/15 text-amber-300")
                      }
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.review_notes && (
                    <p className="mt-3 border-l-2 border-copper-400/40 pl-3 text-xs italic text-stone-400">
                      Staff note: {r.review_notes}
                    </p>
                  )}
                  {r.status === "Pending" && (
                    <div className="mt-4">
                      <LoaWithdraw id={r.id} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
