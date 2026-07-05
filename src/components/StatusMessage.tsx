interface StatusMessageProps {
  title: string;
  description?: string;
}

export function StatusMessage({ title, description }: StatusMessageProps) {
  return (
    <section className="card muted-card">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </section>
  );
}
