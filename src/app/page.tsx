import Link from "next/link";
import { categorias, getDestacados } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const articulosBlog = [
  {
    slug: "el-arte-quimico-de-las-velas",
    titulo: "El arte químico de las velas: cómo se libera el aroma",
    fecha: "13 de junio de 2025",
    extracto: "La volatilidad de los aceites esenciales varía…",
    imagen: "/blog/quimica-velas.jpg",
  },
  {
    slug: "por-que-una-vela-cambia-tu-animo",
    titulo: "¿Por qué una vela puede cambiar tu estado de ánimo?",
    fecha: "13 de junio de 2025",
    extracto: "El olfato está directamente conectado al sistema límbico.",
    imagen: "/blog/estado-de-animo.jpg",
  },
];

export default async function HomePage() {
  const destacados = await getDestacados();

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[520px] items-center bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-velas.jpg"
          alt="Velas encendidas"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 md:px-8">
          <h1 className="font-display text-4xl font-bold text-white md:text-6xl">
            Velas Aromatizadas
          </h1>
          <p className="mt-4 max-w-md border-t border-white/40 pt-4 text-white/90">
            Ambiente sus espacios con las fragancias mas exclusivas
          </p>
          <Link
            href="/catalogo"
            className="btn-pill mt-8 border-white text-white hover:bg-white hover:text-ink"
          >
            Comprar Ahora
          </Link>
        </div>
      </section>

      {/* Destacado editorial */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/productos/vela-acanalada.jpg"
          alt="Vela sobre mármol"
          className="aspect-square w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col justify-center gap-4">
          <h2 className="font-display text-3xl font-bold text-ink">
            Mantén tus espacios agradables con nuestras velas aromáticas
          </h2>
          <p className="text-ink/70">
            Elaboradas de forma artesanal, pensadas para acompañar momentos de
            calma, oración y celebración en tu hogar.
          </p>
          <Link
            href="/catalogo"
            className="btn-pill w-fit border-ink/40 text-ink/70 hover:border-ink hover:text-ink"
          >
            Comprar Ahora
          </Link>
        </div>
      </section>

      {/* Colecciones */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <h2 className="mb-6 font-display text-3xl font-bold text-ink">
          Colecciones
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className="overflow-hidden rounded-2xl border border-ink/15"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="aspect-square w-full object-cover"
              />
              <div className="p-4">
                <p className="font-display font-semibold text-ink">
                  {cat.nombre} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner ancho */}
      <section className="relative flex min-h-[420px] items-center justify-center bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banner-velas.jpg"
          alt="Altar con velas"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative z-10 mx-4 max-w-xl rounded-2xl bg-cream p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Velas para cada momento
          </h2>
          <p className="mt-3 text-ink/70">
            Ofrecemos un variado catálogo de velas, con todos los colores y
            tamaños, realice su pedido hoy mismo y denos el gusto de
            atenderlo
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/catalogo"
              className="btn-pill border-ink/40 text-ink/70 hover:border-ink hover:text-ink"
            >
              Catálogo
            </Link>
            <Link
              href="/empresa"
              className="btn-pill border-ink/40 text-ink/70 hover:border-ink hover:text-ink"
            >
              Empresa
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-6 font-display text-3xl font-bold text-ink">
          Productos Destacados
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Regalo */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 md:grid-cols-2 md:px-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-bold text-ink">
            El regalo perfecto que todos quieren tener
          </h2>
          <p className="text-ink/70">
            Sorpréndelos con nuestros paquetes y envolturas especiales, para
            darle ese toque único y elegante, a esa persona que tanto
            quieres.
          </p>
          <Link
            href="/contacto"
            className="btn-pill w-fit border-ink/40 text-ink/70 hover:border-ink hover:text-ink"
          >
            Cotizar Empaque
          </Link>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/regalo-vela.jpg"
          alt="Vela envuelta como regalo"
          className="aspect-square w-full rounded-2xl object-cover"
        />
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <h2 className="mb-6 font-display text-3xl font-bold text-ink">
          Artículos del blog
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {articulosBlog.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-ink/15"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imagen}
                alt={post.titulo}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-display font-semibold text-ink">
                  {post.titulo}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {post.fecha}
                </p>
                <p className="mt-2 text-ink/70">{post.extracto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="bg-brand py-16">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-8">
          <h2 className="font-display text-3xl font-bold text-white">
            Formulario de contacto
          </h2>
          <ContactoFormInline />
        </div>
      </section>
    </>
  );
}

function ContactoFormInline() {
  return (
    <form
      action="/api/contacto"
      method="POST"
      className="mt-8 grid gap-4 text-left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="nombre"
          placeholder="Nombre"
          className="rounded-pill border border-white/70 bg-transparent px-5 py-3 text-white placeholder-white/80 outline-none"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Correo electrónico *"
          className="rounded-pill border border-white/70 bg-transparent px-5 py-3 text-white placeholder-white/80 outline-none"
        />
      </div>
      <input
        name="telefono"
        placeholder="Número de teléfono"
        className="rounded-pill border border-white/70 bg-transparent px-5 py-3 text-white placeholder-white/80 outline-none"
      />
      <textarea
        name="comentario"
        placeholder="Comentario"
        rows={4}
        className="rounded-2xl border border-white/70 bg-transparent px-5 py-3 text-white placeholder-white/80 outline-none"
      />
      <button
        type="submit"
        className="btn-pill mx-auto border-white bg-white text-ink hover:opacity-90"
      >
        Enviar
      </button>
    </form>
  );
}
