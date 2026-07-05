interface InlineLoaderProps {
  message?: string;
}

export function InlineLoader({ message = "Cargando información..." }: InlineLoaderProps) {
  return <div className="inline-loader">{message}</div>;
}
