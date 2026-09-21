import { describe, expect, it } from "vitest";
import { exercises } from "./exercises";
import { compareExerciseIds, filterExercises, sortExercisesById } from "./exerciseSelectors";

describe("exercise selectors", () => {
  const base = { query: "", capability: "all", equipment: "all", movementPattern: "all" };

  it("searches aliases", () => {
    expect(filterExercises(exercises,{...base,query:"reverse lunge"}).map((item)=>item.identity.id)).toEqual(["EX-006"]);
  });

  it("combines capability, equipment and movement pattern filters", () => {
    const result = filterExercises(exercises,{...base,capability:"strength",equipment:"dumbbell",movementPattern:"pull"});
    expect(result.map((item)=>item.identity.id)).toEqual(["EX-012"]);
  });

  it("sorts exercise IDs numerically and supports future three-digit IDs", () => {
    expect(["EX-100", "EX-015", "EX-002"].sort(compareExerciseIds)).toEqual(["EX-002", "EX-015", "EX-100"]);
    expect(sortExercisesById([...exercises].reverse()).map((item) => item.identity.id)).toEqual(exercises.map((item) => item.identity.id));
  });
});
