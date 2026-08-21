import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { exercises } from "./exercises";
import { exerciseIndex } from "./exerciseIndex";
import { ASSET_STATUSES, CAPABILITY_TAXONOMY, CONTENT_STATUSES, EQUIPMENT_TAXONOMY, MEDIA_STATUSES } from "../domain/taxonomies";

describe("exercise library integrity", () => {
  it("contains 15 usable exercises and a 25-entry canonical index", () => {
    expect(exercises).toHaveLength(15);
    expect(exerciseIndex).toHaveLength(25);
    expect(exercises.every((exercise) => exercise.identity.contentStatus === "usable")).toBe(true);
  });

  it("has unique IDs and slugs", () => {
    const ids = exercises.map((exercise) => exercise.identity.id);
    const slugs = exercises.map((exercise) => exercise.identity.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only references canonical exercise IDs", () => {
    const ids = new Set(exerciseIndex.map((entry) => entry.id));
    const targets = exercises.flatMap((exercise) => Object.values(exercise.relations).flat().map((relation) => relation.targetId).filter(Boolean));
    expect(targets.filter((target) => !ids.has(target!))).toEqual([]);
  });

  it("declares only known taxonomies and valid statuses", () => {
    for (const exercise of exercises) {
      expect(CONTENT_STATUSES).toContain(exercise.identity.contentStatus);
      expect(MEDIA_STATUSES).toContain(exercise.media.status);
      for (const item of exercise.classification.capabilities) expect(Object.hasOwn(CAPABILITY_TAXONOMY,item.id)).toBe(true);
      for (const item of exercise.context.equipment) expect(Object.hasOwn(EQUIPMENT_TAXONOMY,item.id)).toBe(true);
      for (const asset of Object.values(exercise.media).filter((value) => typeof value === "object")) expect(ASSET_STATUSES).toContain(asset.status);
    }
  });

  it("only declares media paths that exist", () => {
    const paths = exercises.flatMap((exercise) => [exercise.media.masterImage,exercise.media.thumbnail,exercise.media.infographic,exercise.media.sessionCard,exercise.media.visualBrief].flatMap((asset) => asset.sourcePath ? [asset.sourcePath] : []));
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.filter((path) => !existsSync(resolve(process.cwd(),path)))).toEqual([]);
  });
});
