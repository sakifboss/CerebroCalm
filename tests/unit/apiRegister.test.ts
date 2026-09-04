import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/register/route";
import { registrationRepository } from "@/lib/registrationRepo";
import { NextRequest } from "next/server";

describe("Registration API Route & Repository", () => {
  beforeEach(async () => {
    await registrationRepository.clear();
  });

  const createRequest = (body: any) =>
    new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  it("registers a valid user successfully", async () => {
    const req = createRequest({ name: "Taylor Swift", email: "taylor@example.com" });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.name).toBe("Taylor Swift");
    expect(data.user.email).toBe("taylor@example.com");
    expect(data.count).toBeGreaterThan(500);
  });

  it("returns 400 when name is missing or too short", async () => {
    const req = createRequest({ name: " ", email: "valid@example.com" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Please enter your name.");
  });

  it("returns 400 when email is invalid", async () => {
    const req = createRequest({ name: "Taylor Swift", email: "not-an-email" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Please enter a valid email address.");
  });

  it("returns 409 when email is already registered", async () => {
    const req1 = createRequest({ name: "User One", email: "duplicate@example.com" });
    await POST(req1);

    const req2 = createRequest({ name: "User Two", email: "duplicate@example.com" });
    const res2 = await POST(req2);
    expect(res2.status).toBe(409);

    const data2 = await res2.json();
    expect(data2.error).toBe("This email is already registered.");
  });

  it("handles case-insensitive and trimmed email normalization", async () => {
    const req1 = createRequest({ name: "User One", email: "caseTest@Example.COM " });
    await POST(req1);

    const req2 = createRequest({ name: "User Two", email: "   casetest@example.com" });
    const res2 = await POST(req2);
    expect(res2.status).toBe(409);
  });

  it("provides total registration count via GET", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.count).toBe("number");
    expect(data.count).toBeGreaterThanOrEqual(520);
  });
});
