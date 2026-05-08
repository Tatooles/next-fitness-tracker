import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const workoutFormFiles = [
  "components/workout-form/workout-form.tsx",
  "components/workout-form/workout-form-header.tsx",
  "components/workout-form/exercise-item.tsx",
  "components/workout-form/form-sets.tsx",
];

describe("WorkoutForm TanStack Form migration", () => {
  it("removes react-hook-form from the main workout form modules", () => {
    for (const file of workoutFormFiles) {
      const source = readFileSync(join(process.cwd(), file), "utf8");

      expect(source, file).not.toContain("react-hook-form");
    }
  });
});
