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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ExerciseHistoryModal
          exerciseName={exerciseName}
          filterOutWorkoutId={workoutId}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <History className="h-4 w-4" />
            View History
          </DropdownMenuItem>
        </ExerciseHistoryModal>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

