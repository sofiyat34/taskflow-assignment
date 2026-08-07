'use client';

import { ErrorPanel } from '@/components/ui';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPanel
      message={error.message}
      onRetry={reset}
    />
  );
}