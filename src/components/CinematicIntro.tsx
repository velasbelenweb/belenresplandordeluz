/**
 * Antes mostraba una cortinilla de ~1.85s (dos paneles que se abrían + logo)
 * cada vez que alguien entraba al sitio. Se desactivó por rendimiento
 * percibido: retrasaba la primera interacción del usuario con la página.
 * Se deja el componente vacío en vez de borrar el archivo para no tener que
 * tocar layout.tsx, que sigue importándolo.
 */
export default function CinematicIntro() {
  return null;
}
