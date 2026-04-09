"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  History,
  MoreVertical,
  Trash2,
} from "lucide-react";
import ExerciseHistoryModal from "@/components/exercise/exercise-history-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExerciseActionsMenuProps {
  exerciseName: string;
  workoutId?: number;
  clearFailedSaveState: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function ExerciseActionsMenu({
  exerciseName,
  workoutId,
  clearFailedSaveState,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
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
        <DropdownMenuItem
          onClick={() => {
            clearFailedSaveState();
            onMoveUp();
          }}
          disabled={isFirst}
        >
          <ArrowUp />
          Move Up
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            clearFailedSaveState();
            onMoveDown();
          }}
          disabled={isLast}
        >
          <ArrowDown />
          Move Down
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            clearFailedSaveState();
            onDelete();
          }}
        >
          <Trash2 />
          Delete Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
