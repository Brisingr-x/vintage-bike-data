"use client";

import { useEffect, useMemo, useState } from "react";
import { Bike, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { BikeCard } from "../components/bike-card";
import { BICYCLE_CATEGORIES } from "../types";
import type { VintageBicycle } from "../validation/vintage-bike.schema";

function categoryLabel(category: string) {
  return category.replaceAll("-", " ");
}

export default function HomePage() {
  const [bikes, setBikes] = useState<VintageBicycle[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (category) params.set("category", category);

    setLoading(true);
    setError("");

    fetch(`/api/bikes?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as { bikes?: VintageBicycle[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Could not load bicycle records.");
        setBikes(result.bikes ?? []);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Could not load bicycle records.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category]);

  const filteredBikes = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return bikes;
    return bikes.filter((bike) =>
      `${bike.make} ${bike.model}`.toLocaleLowerCase().includes(term),
    );
  }, [bikes, search]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <header className="flex items-center justify-between border-b border-ink/10 pb-5">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-forest">
          <Bike aria-hidden="true" size={22} />
          <span>Vintage Bike Data</span>
        </Link>
        <span className="hidden text-sm text-ink/55 sm:block">Community-built bicycle archive</span>
      </header>

      <section className="py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rust">
          The bicycle archive
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-6xl">
            Find the details behind the ride.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink/65 sm:text-lg">
            Explore vintage bicycle specifications, frame standards, and the components that made
            each model unique.
          </p>
        </div>

        <div className="mt-9 grid gap-3 rounded-2xl border border-ink/10 bg-white p-3 shadow-card md:grid-cols-[1fr_auto]">
          <label className="flex min-w-0 items-center gap-3 rounded-xl px-3">
            <Search aria-hidden="true" size={20} className="shrink-0 text-ink/45" />
            <span className="sr-only">Search by make or model</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by make or model"
              className="w-full border-0 bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink/45"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-canvas px-3 text-sm text-ink">
            <SlidersHorizontal aria-hidden="true" size={17} className="text-forest" />
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-w-36 cursor-pointer border-0 bg-transparent py-3 capitalize outline-none"
            >
              <option value="">All categories</option>
              {BICYCLE_CATEGORIES.map((item) => (
                <option key={item} value={item} className="capitalize">
                  {categoryLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section aria-labelledby="directory-heading" className="pb-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink/55">Browse the collection</p>
            <h2 id="directory-heading" className="mt-1 text-2xl font-semibold tracking-tight">
              Bicycle directory
            </h2>
          </div>
          <p className="text-sm text-ink/55">
            {loading ? "Loading…" : `${filteredBikes.length} ${filteredBikes.length === 1 ? "record" : "records"}`}
          </p>
        </div>

        {error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/60">
            Loading bicycle records…
          </div>
        ) : filteredBikes.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ink/20 bg-white/70 p-10 text-center">
            <p className="font-medium">No bicycles found</p>
            <p className="mt-1 text-sm text-ink/55">Try another search or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
