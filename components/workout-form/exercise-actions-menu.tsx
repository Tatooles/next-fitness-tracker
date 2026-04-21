"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  History,
  Link2,
  Link2Off,
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
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStartSupersetWithNext: () => void;
  onJoinPreviousSuperset: () => void;
  onRemoveFromSuperset: () => void;
  isFirst: boolean;
  isLast: boolean;
  canStartSupersetWithNext: boolean;
  canJoinPreviousSuperset: boolean;
  isInSuperset: boolean;
}

export default function ExerciseActionsMenu({
  exerciseName,
  workoutId,
  onDelete,
  onMoveUp,
  onMoveDown,
  onStartSupersetWithNext,
  onJoinPreviousSuperset,
  onRemoveFromSuperset,
  isFirst,
  isLast,
  canStartSupersetWithNext,
  canJoinPreviousSuperset,
  isInSuperset,
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
        {canStartSupersetWithNext ? (
          <DropdownMenuItem onClick={onStartSupersetWithNext}>
            <Link2 />
            Start Superset With Next
          </DropdownMenuItem>
        ) : null}
        {canJoinPreviousSuperset ? (
          <DropdownMenuItem onClick={onJoinPreviousSuperset}>
            <Link2 />
            Join Previous Superset
          </DropdownMenuItem>
        ) : null}
        {isInSuperset ? (
          <DropdownMenuItem onClick={onRemoveFromSuperset}>
            <Link2Off />
            Remove From Superset
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          Delete Exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
