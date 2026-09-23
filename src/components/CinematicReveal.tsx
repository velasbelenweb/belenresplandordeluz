import type { ElementType, ReactNode } from "react";

export type RevealVariant =
  | "fade-up"
  | "scale-in"
  | "wipe-left"
  | "wipe-right"
  | "curtain";

interface CinematicRevealProps {
  children: ReactNode;
  /** Ya no se usa (los efectos de aparición se desactivaron por rendimiento);
   * se deja la prop para no tener que tocar cada página que la pasa. */
  variant?: RevealVariant;
  /** Ya no se usa. */
  delay?: number;
  className?: string;
  /** Elemento HTML en el que se renderiza (section, div, article...). */
  as?: ElementType;
}

/**
 * Antes envolvía cada sección en una animación de aparición al hacer scroll
 * (IntersectionObserver + transición de 1.1s por sección, más
 * will-change-transform en cada bloque). Se desactivó porque hacía sentir la
 * página lenta / con retraso en cada bloque; ahora solo renderiza el
 * contenido directamente, sin costo de JS ni animación.
 */
export default function CinematicReveal({
  children,
  className = "",
  as: Tag = "div",
}: CinematicRevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
