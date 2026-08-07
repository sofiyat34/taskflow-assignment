'use client';

import { useState } from 'react';

import { TaskCard } from '@/components/tasks/TaskCard';
import { COLUMNS, TaskColumn } from '@/components/tasks/TaskColumn';
import {
  BoardSkeleton,
  EmptyState,
  ErrorPanel,
} from '@/components/ui';

import { useTasks } from '@/hooks/useTasks';
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus';
import { useDeleteTask } from '@/hooks/useDeleteTask';

import type { TaskStatus } from '@/types/database';


export function Board({ projectId }: { projectId: string }) {
  // Get tasks from React Query
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useTasks(projectId);


  // Mutations
  const updateStatus = useUpdateTaskStatus(projectId);
  const deleteTask = useDeleteTask(projectId);


  // Pure UI state - remembers the task being dragged
  const [draggingId, setDraggingId] = useState<string | null>(null);



  // Loading state
  if (isLoading) {
    return <BoardSkeleton />;
  }



  // Error state
  if (error) {
    return (
      <ErrorPanel
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }



  // Empty state
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started."
      />
    );
  }



  function moveTask(id: string, status: TaskStatus) {
    updateStatus.mutate({
      id,
      status,
    });
  }



  return (
    <div className="board">

      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status
        );


        return (
          <TaskColumn
            key={column.status}
            status={column.status}
            label={column.label}
            count={columnTasks.length}

            onDropTask={(status) => {
              // Nothing is being dragged
              if (!draggingId) return;


              const draggedTask = tasks.find(
                (task) => task.id === draggingId
              );


              // Prevent unnecessary update
              if (
                !draggedTask ||
                draggedTask.status === status
              ) {
                return;
              }


              moveTask(draggingId, status);
            }}
          >

            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}


                // Move using arrow buttons
                onMove={(status) =>
                  moveTask(task.id, status)
                }


                // Delete task
                onDelete={() =>
                  deleteTask.mutate(task.id)
                }


                // Drag start
                onDragStart={() =>
                  setDraggingId(task.id)
                }


                // Drag end
                onDragEnd={() =>
                  setDraggingId(null)
                }


                isDragging={
                  draggingId === task.id
                }
              />
            ))}


          </TaskColumn>
        );
      })}

    </div>
  );
}