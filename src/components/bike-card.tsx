import Link from "next/link";
import { ArrowUpRight, Bike } from "lucide-react";

import type { VintageBicycle } from "../validation/vintage-bike.schema";
import { Card, CardContent } from "./ui/card";

function categoryLabel(category: string) {
  return category.replaceAll("-", " ");
}

export function BikeCard({ bike }: { bike: VintageBicycle }) {
  const identifier = bike.id ?? `${bike.make}-${bike.model}-${bike.modelYear}`;

  return (
    <Link
      href={`/bikes/${encodeURIComponent(identifier)}`}
      className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
    >
      <Card className="h-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardContent className="p-5">
          <div className="mb-7 flex items-start justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-1.5 text-xs font-medium capitalize text-forest">
              <Bike aria-hidden="true" size={14} />
              {categoryLabel(bike.category)}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              size={18}
              className="text-ink/40 transition group-hover:text-rust"
            />
          </div>
          <p className="text-sm font-medium text-ink/55">{bike.make}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            {bike.model}
          </h2>
          <p className="mt-1 text-sm text-ink/60">{bike.modelYear}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink/45">Frame</p>
              <p className="mt-1 font-medium capitalize">{bike.frame.material}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink/45">Tubing</p>
              <p className="mt-1 line-clamp-2 font-medium">{bike.frame.tubing}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
