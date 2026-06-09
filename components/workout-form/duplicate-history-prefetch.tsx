"use client";

import {
    getExerciseHistory,
    getExerciseHistoryKey,
} from "@/components/exercise/exercise-history-data";
import { useMemo } from "react";
import useSWR, { unstable_serialize, useSWRConfig } from "swr";

function getUniqueExerciseNames(exerciseNames: string[]): string[] {
    const seen = new Set<string>();
    const uniqueNames: string[] = [];

    for (const exerciseName of exerciseNames) {
        const trimmedName = exerciseName.trim();

        if (!trimmedName || seen.has(trimmedName)) {
            continue;
        }

        seen.add(trimmedName);
        uniqueNames.push(trimmedName);
    }

    return uniqueNames;
}

function ExerciseHistoryPrefetch({
    exerciseName,
    userId,
}: {
    exerciseName: string;
    userId: string | null | undefined;
}) {
    useSWR(
        getExerciseHistoryKey({ exerciseName, userId }),
        () => getExerciseHistory(exerciseName),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
        },
    );

    return null;
}

export default function DuplicateWorkoutHistoryPrefetch({
    exerciseNames,
}: {
    exerciseNames: string[];
}) {
    const { isLoaded, userId } = useAuth();
    const { cache } = useSWRConfig();
    const uniqueExerciseNames = useMemo(
        () => getUniqueExerciseNames(exerciseNames),
        [exerciseNames],
    );
    const exerciseNamesToPrefetch = useMemo(() => {
        if (!isLoaded) {
            return [];
        }

        return uniqueExerciseNames.filter((exerciseName) => {
            const historyKey = getExerciseHistoryKey({ exerciseName, userId });
            const serializedKey = unstable_serialize(historyKey);

            return cache.get(serializedKey) === undefined;
        });
    }, [cache, isLoaded, uniqueExerciseNames, userId]);

    return (
        <>
            {exerciseNamesToPrefetch.map((exerciseName) => (
                <ExerciseHistoryPrefetch
                    key={exerciseName}
                    exerciseName={exerciseName}
                    userId={userId}
                />
            ))}
        </>
    );
}