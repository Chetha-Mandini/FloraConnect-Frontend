import process from "node:process";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import reference from "./flower-reference.json";
import { flowers, referenceFlowerCount, flowerSupplements } from "./flowers";
import { normalizeFlowerText } from "../normalizeFlowerText";

describe("expanded botanical catalogue", () => {
  it("includes every supplied named entry with its full description", () => {
    expect(referenceFlowerCount).toBe(464);
    for (const entry of reference) {
      const flower = flowers.find((item) => item.id === entry.id);
      expect(flower?.name).toBe(entry.name);
      expect(flower?.detail).toBe(
        flowerSupplements[entry.id]?.detail ?? entry.detail,
      );
      expect(flower?.source).toBe(
        flowerSupplements[entry.id]?.source ??
          "https://www.bioexplorer.net/plants/flowers/",
      );
    }
  });

  it("enriches the matching attachments without adding duplicate cards", () => {
    expect(Object.keys(flowerSupplements)).toHaveLength(191);
    expect(flowers).toHaveLength(469);
    expect(
      new Set(flowers.map((flower) => normalizeFlowerText(flower.name))).size,
    ).toBe(flowers.length);
    for (const [id, supplement] of Object.entries(flowerSupplements)) {
      expect(flowers.filter((flower) => flower.id === id)).toHaveLength(1);
      expect(flowers.find((flower) => flower.id === id)?.detail).toBe(
        supplement.detail,
      );
    }
  });

  it("normalizes typographic names without losing their canonical identity", () => {
    expect(normalizeFlowerText("Adam’s Needle")).toBe(
      normalizeFlowerText("Adam's Needle"),
    );
    expect(normalizeFlowerText("Forget-Me-Not")).toBe(
      normalizeFlowerText("forget me not"),
    );
    expect(normalizeFlowerText("Bergénia")).toBe(
      normalizeFlowerText("bergenia"),
    );
  });

  it("preserves existing catalogue varieties with unique IDs", () => {
    expect(new Set(flowers.map((flower) => flower.id)).size).toBe(
      flowers.length,
    );
    for (const name of [
      "Rose",
      "Orchid",
      "Anthurium",
      "Sunflower",
      "Water Lily",
      "Gerbera",
      "Chrysanthemum",
    ]) {
      expect(flowers.some((flower) => flower.name === name)).toBe(true);
    }
    expect(flowers.every((flower) => flower.detail.length > 0)).toBe(true);
  });

  it("uses existing local photos and retains attribution for new photos", () => {
    expect(flowers.every((flower) => Boolean(flower.image))).toBe(true);
    for (const flower of flowers) {
      if (flower.image)
        expect(existsSync(join(process.cwd(), "public", flower.image))).toBe(
          true,
        );
      if (flower.photoCredit) {
        expect(flower.photoCredit.sourceUrl).toMatch(
          /^https:\/\/commons.wikimedia.org\//,
        );
        expect(flower.photoCredit.author.length).toBeGreaterThan(0);
        expect(flower.photoCredit.license).toMatch(/CC|public domain|PD/i);
      }
    }
  });
});
