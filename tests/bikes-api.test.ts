import { describe, expect, it } from "vitest";

import { GET, POST } from "../src/app/api/bikes/route";

describe("bicycle API validation", () => {
  it("rejects unsupported category filters", async () => {
    const response = await GET(new Request("http://localhost/api/bikes?category=road_racing"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "category is not supported.",
    });
  });

  it("rejects invalid model years", async () => {
    const response = await GET(new Request("http://localhost/api/bikes?modelYear=1899"));

    expect(response.status).toBe(400);
  });

  it("rejects invalid JSON bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/bikes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Request body must be valid JSON.",
    });
  });

  it("rejects payloads that do not match the bicycle schema", async () => {
    const response = await POST(
      new Request("http://localhost/api/bikes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ make: "Specialized" }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Bicycle record failed validation.",
    });
  });
});
