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
  workoutId: number;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function ExerciseActionsMenu({
  exerciseName,
  workoutId,
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
        <DropdownMenuItem onClick={onMoveUp} disabled={isFirst}>
          <ArrowUp />
          Move Up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMoveDown} disabled={isLast}>
          <ArrowDown />
          Move Down
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          Delete Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
