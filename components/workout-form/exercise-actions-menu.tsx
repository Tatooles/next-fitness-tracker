"use client";
import { Button } from "@/components/ui/button";
import { History, MoreVertical, Trash2 } from "lucide-react";
import ExerciseHistoryModal from "@/components/exercise/exercise-history-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExerciseActionsMenuProps {
  exerciseName: string;
  workoutId: number;
  onDelete: () => void;
}

export default function ExerciseActionsMenu({
  exerciseName,
  workoutId,
  onDelete,
}: ExerciseActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ExerciseHistoryModal
          exerciseName={exerciseName}
          filterOutWorkoutId={workoutId}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <History />
            View History
          </DropdownMenuItem>
        </ExerciseHistoryModal>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          Delete Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
