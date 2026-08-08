'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateTask } from '@/hooks/useCreateTask';
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
} from '@/components/ui';

import {
  createTaskSchema,
  type CreateTaskInput,
} from '@/lib/validation/task';

import { TASK_PRIORITIES } from '@/types/database';

/*
 * TODO 5 — New Task Form
 *
 * This form uses:
 * - React Hook Form for managing form state
 * - Zod for validation
 * - useCreateTask for saving the task
 */

export function TaskForm({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  // Hook that handles creating a task
  const createTask = useCreateTask(projectId, userId);

  /*
   * Set up React Hook Form.
   *
   * zodResolver connects React Hook Form to our Zod schema.
   */
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),

    // Initial values for the form
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
    },
  });

  /*
   * This function runs when the form is submitted.
   */
  async function onSubmit(values: CreateTaskInput) {
    try {
      // Save the task
      await createTask.mutateAsync(values);

      // Clear the form after successful submission
      reset();
    } catch (error) {
      // Display an error if something goes wrong
      setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong.',
      });
    }
  }

  /*
   * The actual form displayed on the page.
   */
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Title */}
      <Field
        label="Title"
        htmlFor="title"
        error={errors.title?.message}
      >
        <Input
          id="title"
          {...register('title')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title ? 'title-error' : undefined
          }
        />
      </Field>

      {/* Description */}
      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? 'description-error'
              : undefined
          }
        />
      </Field>

      {/* Status */}
      <Field
        label="Status"
        htmlFor="status"
        error={errors.status?.message}
      >
        <Select
          id="status"
          {...register('status')}
          aria-invalid={Boolean(errors.status)}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </Field>

      {/* Priority */}
      <Field
        label="Priority"
        htmlFor="priority"
        error={errors.priority?.message}
      >
        <Select
          id="priority"
          {...register('priority')}
          aria-invalid={Boolean(errors.priority)}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
      </Field>

      {/* General form error */}
      {errors.root?.message && (
        <p role="alert">{errors.root.message}</p>
      )}

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  );
}