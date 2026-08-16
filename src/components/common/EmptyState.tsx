export type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="mx-auto h-px w-12 bg-gold" />
      <p className="mt-6 text-base text-navy/60">{message}</p>
    </div>
  );
}
