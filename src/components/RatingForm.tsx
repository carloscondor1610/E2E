import { FormEvent, useState } from "react";
import { ErrorMessage } from "./ErrorMessage";

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting?: boolean;
}

const ratingOptions = [1, 2, 3, 4, 5];

export function RatingForm({ onSubmit, isSubmitting = false }: RatingFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Selecciona una calificación entre 1 y 5.");
      return;
    }

    try {
      await onSubmit(rating, comment.trim());
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la calificación.");
    }
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <div>
        <span className="field-label">Calificación</span>
        <div className="rating-options" role="radiogroup" aria-label="Calificación del conductor">
          {ratingOptions.map((value) => (
            <button
              key={value}
              type="button"
              className={value <= rating ? "star-button active" : "star-button"}
              onClick={() => setRating(value)}
              aria-pressed={value <= rating}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label>
        Comentario opcional
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ej. Conductor puntual y amable"
          rows={4}
        />
      </label>

      <ErrorMessage message={error} />

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar calificación"}
      </button>
    </form>
  );
}
