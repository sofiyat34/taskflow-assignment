import { GridSkeleton } from '@/components/ui';

/**
 * Put a file called loading.tsx in a folder and Next.js wraps that
 * route in <Suspense> for you. No configuration, no boilerplate.
 *
 * Shown while the server component above is awaiting the database.
 */
export default function Loading() {
  return (
    <>
      <div className="page-head">
        <h1>Your projects</h1>
      </div>
      <GridSkeleton count={3} />
    </>
  );
}

