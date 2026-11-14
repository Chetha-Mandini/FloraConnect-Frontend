import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./auth";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("API request deadlines", () => {
  it("retains the timeout when a caller supplies an unmount cancellation signal", async () => {
    const deadline = new AbortController();
    const timeout = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(deadline.signal);
    let combined: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            combined = options.signal;
            combined?.addEventListener("abort", () =>
              reject(new DOMException("Timed out", "AbortError")),
            );
          }),
      ),
    );
    const controller = new AbortController();
    const result = expect(
      api("/auth/me", { signal: controller.signal }),
    ).rejects.toThrow("Unable to reach FloraConnect");
    deadline.abort();
    await result;
    expect(combined?.aborted).toBe(true);
    expect(timeout).toHaveBeenCalledWith(15000);
    expect(controller.signal.aborted).toBe(false);
  });
});
