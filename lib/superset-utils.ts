type ExerciseWithSupersetGroup = {
  supersetGroupId: string | null;
};

export type ExerciseDisplayBlock<T extends ExerciseWithSupersetGroup> =
  | {
      kind: "single";
      startIndex: number;
      endIndex: number;
      supersetGroupId: null;
      exercises: T[];
    }
  | {
      kind: "superset";
      startIndex: number;
      endIndex: number;
      supersetGroupId: string;
      exercises: T[];
    };

function cloneExercises<T>(exercises: T[]): T[] {
  return structuredClone(exercises);
}

function normalizeSupersetGroups<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
): T[] {
  const validGroupIds = new Set<string>();
  const invalidGroupIds = new Set<string>();

  for (let index = 0; index < exercises.length; index += 1) {
    const groupId = exercises[index]?.supersetGroupId;

    if (!groupId) {
      continue;
    }

    let endIndex = index;

    while (endIndex + 1 < exercises.length && exercises[endIndex + 1]?.supersetGroupId === groupId) {
      endIndex += 1;
    }

    const blockSize = endIndex - index + 1;

    if (blockSize < 2 || validGroupIds.has(groupId)) {
      invalidGroupIds.add(groupId);
    } else if (!invalidGroupIds.has(groupId)) {
      validGroupIds.add(groupId);
    }

    index = endIndex;
  }

  return exercises.map((exercise) => {
    if (exercise.supersetGroupId && invalidGroupIds.has(exercise.supersetGroupId)) {
      return {
        ...exercise,
        supersetGroupId: null,
      };
    }

    return exercise;
  });
}

function getSupersetBlockRange<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
) {
  const groupId = exercises[index]?.supersetGroupId;

  if (!groupId) {
    return {
      startIndex: index,
      endIndex: index,
    };
  }

  let startIndex = index;
  let endIndex = index;

  while (startIndex > 0 && exercises[startIndex - 1]?.supersetGroupId === groupId) {
    startIndex -= 1;
  }

  while (
    endIndex < exercises.length - 1 &&
    exercises[endIndex + 1]?.supersetGroupId === groupId
  ) {
    endIndex += 1;
  }

  return {
    startIndex,
    endIndex,
  };
}

export function startSupersetWithNext<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
  supersetGroupId: string,
): T[] {
  const nextExercises = cloneExercises(exercises);

  if (!nextExercises[index + 1]) {
    return nextExercises;
  }

  nextExercises[index].supersetGroupId = supersetGroupId;
  nextExercises[index + 1].supersetGroupId = supersetGroupId;

  return normalizeSupersetGroups(nextExercises);
}

export function joinSupersetWithPrevious<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
  createSupersetGroupId: () => string,
): T[] {
  const nextExercises = cloneExercises(exercises);
  const previousExercise = nextExercises[index - 1];
  const currentExercise = nextExercises[index];

  if (!previousExercise || !currentExercise) {
    return nextExercises;
  }

  const supersetGroupId =
    previousExercise.supersetGroupId ?? createSupersetGroupId();

  previousExercise.supersetGroupId = supersetGroupId;
  currentExercise.supersetGroupId = supersetGroupId;

  return normalizeSupersetGroups(nextExercises);
}

export function removeExerciseFromSuperset<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
): T[] {
  const nextExercises = cloneExercises(exercises);

  if (!nextExercises[index]) {
    return nextExercises;
  }

  nextExercises[index].supersetGroupId = null;

  return normalizeSupersetGroups(nextExercises);
}

export function removeExerciseAtIndex<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
): T[] {
  const nextExercises = cloneExercises(exercises);

  nextExercises.splice(index, 1);

  return normalizeSupersetGroups(nextExercises);
}

export function moveExerciseBlock<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
  index: number,
  direction: "up" | "down",
): T[] {
  const nextExercises = cloneExercises(exercises);
  const { startIndex, endIndex } = getSupersetBlockRange(nextExercises, index);

  if (direction === "up" && startIndex === 0) {
    return nextExercises;
  }

  if (direction === "down" && endIndex === nextExercises.length - 1) {
    return nextExercises;
  }

  const block = nextExercises.splice(startIndex, endIndex - startIndex + 1);
  const insertionIndex =
    direction === "up" ? startIndex - 1 : startIndex + 1;

  nextExercises.splice(insertionIndex, 0, ...block);

  return nextExercises;
}

export function groupExercisesForDisplay<T extends ExerciseWithSupersetGroup>(
  exercises: T[],
): ExerciseDisplayBlock<T>[] {
  const blocks: ExerciseDisplayBlock<T>[] = [];
  let index = 0;

  while (index < exercises.length) {
    const exercise = exercises[index];
    const supersetGroupId = exercise.supersetGroupId;

    if (!supersetGroupId) {
      blocks.push({
        kind: "single",
        startIndex: index,
        endIndex: index,
        supersetGroupId: null,
        exercises: [exercise],
      });
      index += 1;
      continue;
    }

    let endIndex = index;

    while (
      endIndex + 1 < exercises.length &&
      exercises[endIndex + 1].supersetGroupId === supersetGroupId
    ) {
      endIndex += 1;
    }

    if (endIndex === index) {
      blocks.push({
        kind: "single",
        startIndex: index,
        endIndex: index,
        supersetGroupId: null,
        exercises: [exercise],
      });
      index += 1;
      continue;
    }

    blocks.push({
      kind: "superset",
      startIndex: index,
      endIndex,
      supersetGroupId,
      exercises: exercises.slice(index, endIndex + 1),
    });
    index = endIndex + 1;
  }

  return blocks;
}
