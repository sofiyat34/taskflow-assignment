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

/* ===========================================================================
 * TODO 5 — the new-task form, with React Hook Form + Zod
 *
 * Open `src/app/login/LoginForm.tsx` first. Two fields, five useStates, manual
 * loading and error tracking. Now imagine twelve fields.
 *
 * This form has four fields, full validation, accessible error messages and a
 * disabled-while-saving button — and it will end up SHORTER than that one.
 *
 * Imports you will need:
 *
 *   import { useForm } from 'react-hook-form';
 *   import { zodResolver } from '@hookform/resolvers/zod';
 *   import { Button, Field, Input, Select, Textarea } from '@/components/ui';
 *   import { useCreateTask } from '@/hooks/useCreateTask';
 *   import { createTaskSchema, type CreateTaskInput } from '@/lib/validation/task';
 *   import { TASK_PRIORITIES } from '@/types/database';
 *
 * ---------------------------------------------------------------------------
 * 1. Set up the form
 *
 *      const {
 *        register, handleSubmit, reset, setError,
 *        formState: { errors, isSubmitting },
 *      } = useForm<CreateTaskInput>({
 *        resolver: zodResolver(createTaskSchema),
 *        defaultValues: { title: '', description: '', status: 'todo', priority: 'medium' },
 *      });
 *
 *    `zodResolver` is the BRIDGE. React Hook Form knows nothing about Zod;
 *    Zod knows nothing about React. The resolver is the adapter between them,
 *    which is why you could swap Zod for Yup without touching this file.
 *
 *    ALWAYS set defaultValues. Leave them out and the inputs start undefined,
 *    React calls them uncontrolled, and you get the yellow console warning the
 *    first time somebody types.
 *
 * 2. Register each field
 *
 *      <Input id="title" {...register('title')} />
 *
 *    That spread is FOUR things at once: name, onChange, onBlur and a ref.
 *    RHF keeps the value in the ref, not in state — so typing here re-renders
 *    NOTHING. Day 1's counter re-rendered on every keystroke; a twenty-field
 *    form doing that on a cheap Android phone is why forms feel laggy.
 *
 * 3. Show the errors, accessibly
 *
 *      <Field label="Title" htmlFor="title" error={errors.title?.message}>
 *      … and on the input:
 *        aria-invalid={Boolean(errors.title)}
 *        aria-describedby={errors.title ? 'title-error' : undefined}
 *
 *    A sighted user sees red. A screen-reader user hears nothing at all
 *    unless you wire this up. Three attributes: the difference between a demo
 *    and a product.
 *
 * 4. Submit
 *
 *      const createTask = useCreateTask(projectId, userId);
 *
 *      async function onSubmit(values: CreateTaskInput) {
 *        try {
 *          await createTask.mutateAsync(values);   // mutateAsync, not mutate:
 *          reset();                                // it returns a promise, so
 *        } catch (error) {                         // `await` works and
 *          setError('root', { … });                // isSubmitting stays true
 *        }                                         // until the server answers
 *      }
 *
 *      <form onSubmit={handleSubmit(onSubmit)} noValidate>
 *
 *    `noValidate` silences the browser's own validation bubbles so Zod is the
 *    only voice in the room.
 *
 *    Disable the button with `isSubmitting`. Without it, an impatient user on
 *    slow wi-fi double-clicks and creates the task twice.
 * =========================================================================== */

export function TaskForm({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const createTask = useCreateTask(projectId, userId);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
    },
  });

  async function onSubmit(values: CreateTaskInput) {
  try {
    await createTask.mutateAsync(values);
    reset();
  } catch (error) {
    setError('root', {
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong.',
    });
  }
}
}