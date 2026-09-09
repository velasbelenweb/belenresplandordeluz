import { notFound } from "next/navigation";
import { getProductBySlug, formatCOP } from "@/lib/products";
import VariantSelector from "@/components/VariantSelector";
import CinematicReveal from "@/components/CinematicReveal";

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-8">
      <CinematicReveal variant="wipe-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imagen}
          alt={product.nombre}
          className="aspect-square w-full rounded-2xl object-cover"
        />
      </CinematicReveal>

      <CinematicReveal variant="fade-up" delay={150}>
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-bold text-ink">
            {product.nombre}
          </h1>
          {product.referencia && (
            <p className="text-sm text-ink/50">Ref: {product.referencia}</p>
          )}
          {product.variantes.length === 0 && (
            <p className="text-xl font-semibold text-ink">
              {formatCOP(product.precioBase)}
            </p>
          )}
          <p className="text-ink/70">{product.descripcion}</p>

          <div className="mt-2">
            <VariantSelector product={product} />
          </div>
        </div>
      </CinematicReveal>
    </section>
  );
}
