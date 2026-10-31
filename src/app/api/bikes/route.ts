import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { connectDatabase, db } from "../../../db";
import { vintageBicycles } from "../../../db/schema";
import {
  bicycleCategorySchema,
  vintageBicycleSchema,
} from "../../../validation/vintage-bike.schema";

function toBike(record: typeof vintageBicycles.$inferSelect) {
  return {
    id: String(record.id),
    make: record.make,
    model: record.model,
    modelYear: record.modelYear,
    category: record.category,
    documentation: record.documentation,
    frame: record.frameSpecification,
    drivetrain: record.drivetrainSpecification,
    brakes: record.brakeSpecification,
    wheels: record.wheelSpecification,
    cockpit: record.cockpitSpecification,
  };
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const idParam = searchParams.get("id");
  const yearParam = searchParams.get("modelYear");
  const categoryParam = searchParams.get("category");

  if (idParam !== null && (!/^\d+$/.test(idParam) || Number(idParam) < 1)) {
    return NextResponse.json({ error: "id must be a positive integer." }, { status: 400 });
  }

  if (yearParam !== null && (!/^\d{4}$/.test(yearParam) || Number(yearParam) < 1900)) {
    return NextResponse.json({ error: "modelYear must be a valid four-digit year." }, { status: 400 });
  }

  const category = categoryParam === null ? undefined : bicycleCategorySchema.safeParse(categoryParam);
  if (category && !category.success) {
    return NextResponse.json(
      { error: "category is not supported.", supportedCategories: bicycleCategorySchema.options },
      { status: 400 },
    );
  }

  const conditions = [];
  const make = searchParams.get("make")?.trim();
  const model = searchParams.get("model")?.trim();
  const search = searchParams.get("search")?.trim();
  const tubingSpec = searchParams.get("tubingSpec")?.trim();

  if (idParam !== null) conditions.push(eq(vintageBicycles.id, Number(idParam)));
  if (make) conditions.push(ilike(vintageBicycles.make, `%${make}%`));
  if (model) conditions.push(ilike(vintageBicycles.model, `%${model}%`));
  if (yearParam !== null) conditions.push(eq(vintageBicycles.modelYear, Number(yearParam)));
  if (category?.success) conditions.push(eq(vintageBicycles.category, category.data));
  if (tubingSpec) {
    conditions.push(
      sql`${vintageBicycles.frameSpecification}->>'tubing' ILIKE ${`%${tubingSpec}%`}`,
    );
  }
  if (search) {
    const searchCondition = or(
      ilike(vintageBicycles.make, `%${search}%`),
      ilike(vintageBicycles.model, `%${search}%`),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  try {
    await connectDatabase();
    const records = await db
      .select()
      .from(vintageBicycles)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(vintageBicycles.modelYear), vintageBicycles.make, vintageBicycles.model)
      .limit(idParam === null ? 100 : 1);

    return NextResponse.json({ bikes: records.map(toBike) });
  } catch (error) {
    console.error("Failed to fetch vintage bicycles:", error);
    return NextResponse.json({ error: "Unable to fetch bicycle records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    throw error;
  }

  const parsed = vintageBicycleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bicycle record failed validation.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await connectDatabase();
    const [record] = await db
      .insert(vintageBicycles)
      .values({
        make: parsed.data.make,
        model: parsed.data.model,
        modelYear: parsed.data.modelYear,
        category: parsed.data.category,
        documentation: parsed.data.documentation,
        frameSpecification: parsed.data.frame,
        drivetrainSpecification: parsed.data.drivetrain,
        brakeSpecification: parsed.data.brakes,
        wheelSpecification: parsed.data.wheels,
        cockpitSpecification: parsed.data.cockpit,
        rawData: { ...parsed.data },
      })
      .returning();

    return NextResponse.json({ bike: toBike(record) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create vintage bicycle:", error);
    return NextResponse.json({ error: "Unable to create bicycle record." }, { status: 500 });
  }
}
