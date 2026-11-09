import { describe, expect, it } from "vitest";
import { leerApiKey } from "./rnvv";

describe("leerApiKey", () => {
  it("returns the trimmed key from RNVV_API_KEY", () => {
    expect(leerApiKey({ RNVV_API_KEY: "  abc123 " })).toBe("abc123");
  });

  it("throws when the key is missing or blank", () => {
    expect(() => leerApiKey({})).toThrow("RNVV_API_KEY is not set");
    expect(() => leerApiKey({ RNVV_API_KEY: "  " })).toThrow("RNVV_API_KEY is not set");
  });
});
