import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Health button", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="healthButton">Check Health</button>
      <pre id="result"></pre>
    `;
  });

  it("should display system status after successful health check", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({
        status: "ok",
        application: "Progree DevOps Task 2",
        redis: "connected",
        database: "connected",
      }),
    });

    await import("../src/app.js");

    document.getElementById("healthButton").click();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.getElementById("result").textContent).toContain(
      "connected"
    );
  });
});