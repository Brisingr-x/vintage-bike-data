"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, Bike } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import type { VintageBicycle } from "../../../validation/vintage-bike.schema";

type DetailTab = "specifications" | "json";

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value !== null && typeof value === "object") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function flattenSpecification(value: unknown, prefix = ""): Array<[string, string]> {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      flattenSpecification(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, formatValue(value)]];
}

function SpecificationCard({ title, value }: { title: string; value: object }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <tbody className="divide-y divide-ink/10">
            {flattenSpecification(value).map(([label, detail]) => (
              <tr key={label}>
                <th scope="row" className="py-3 pr-4 text-left text-sm font-normal capitalize text-ink/55">
                  {label.replaceAll(".", " · ")}
                </th>
                <td className="break-words py-3 text-right text-sm font-medium">{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default function BikeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bike, setBike] = useState<VintageBicycle | null>(null);
  const [tab, setTab] = useState<DetailTab>("specifications");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/bikes?id=${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as { bikes?: VintageBicycle[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Could not load this bicycle.");
        setBike(result.bikes?.[0] ?? null);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Could not load this bicycle.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 lg:px-12">
      <header className="flex items-center justify-between border-b border-ink/10 pb-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-forest">
          <Bike aria-hidden="true" size={22} />
          <span>Vintage Bike Data</span>
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink/65 hover:text-forest">
          <ArrowLeft aria-hidden="true" size={16} />
          Directory
        </Link>
      </header>

      {loading ? (
        <p className="py-16 text-center text-ink/60">Loading bicycle specifications…</p>
      ) : error ? (
        <div role="alert" className="mt-12 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
        </div>
      ) : !bike ? (
        <div className="py-16 text-center">
          <h1 className="text-2xl font-semibold">Bicycle not found</h1>
          <p className="mt-2 text-sm text-ink/60">This record may have been removed or the link is invalid.</p>
        </div>
      ) : (
        <>
          <section className="py-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
              {bike.category.replaceAll("-", " ")} · {bike.modelYear}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{bike.model}</h1>
            <p className="mt-2 text-lg text-ink/60">{bike.make}</p>
          </section>

          <div className="mb-6 flex gap-2 border-b border-ink/10" role="tablist" aria-label="Bicycle details">
            <button
              id="specifications-tab"
              type="button"
              role="tab"
              aria-selected={tab === "specifications"}
              aria-controls="specifications-panel"
              onClick={() => setTab("specifications")}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                tab === "specifications" ? "border-forest text-forest" : "border-transparent text-ink/55"
              }`}
            >
              Specifications
            </button>
            <button
              id="json-tab"
              type="button"
              role="tab"
              aria-selected={tab === "json"}
              aria-controls="json-panel"
              onClick={() => setTab("json")}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                tab === "json" ? "border-forest text-forest" : "border-transparent text-ink/55"
              }`}
            >
              JSON inspection
            </button>
          </div>

          {tab === "specifications" ? (
            <section id="specifications-panel" role="tabpanel" aria-labelledby="specifications-tab" className="grid gap-4 pb-16 md:grid-cols-2">
              <SpecificationCard title="Frame" value={bike.frame} />
              <SpecificationCard title="Drivetrain" value={bike.drivetrain} />
              <SpecificationCard title="Brakes" value={bike.brakes} />
              <SpecificationCard title="Wheels" value={bike.wheels} />
              <SpecificationCard title="Cockpit" value={bike.cockpit} />
              <SpecificationCard title="Documentation" value={bike.documentation} />
            </section>
          ) : (
            <section id="json-panel" role="tabpanel" aria-labelledby="json-tab" className="pb-16">
              <Card>
                <CardContent className="p-0">
                  <pre className="max-h-[70vh] overflow-auto rounded-2xl bg-[#18231f] p-5 text-xs leading-6 text-[#d7e4dc] sm:p-7 sm:text-sm">
                    <code>{JSON.stringify(bike, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            </section>
          )}
        </>
      )}
    </main>
  );
}
