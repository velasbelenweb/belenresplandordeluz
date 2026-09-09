"use client";

import { useState } from "react";
import { Product, formatCOP } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export default function VariantSelector({ product }: { product: Product }) {
  const variantes = product.variantes ?? [];
  const [seleccionada, setSeleccionada] = useState(variantes[0]);

  if (variantes.length === 0) {
    return <AddToCartButton product={product} className="w-full sm:w-auto" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => (
          <button
            key={v.id}
            onClick={() => setSeleccionada(v)}
            className={`btn-pill border-ink/40 text-sm text-ink/70 hover:border-ink hover:text-ink ${
              seleccionada?.id === v.id ? "bg-ink text-white" : ""
            }`}
          >
            {v.nombre}
          </button>
        ))}
      </div>
      <p className="text-xl font-semibold text-ink">
        {formatCOP(seleccionada?.precio ?? product.precioBase)}
      </p>
      <AddToCartButton
        product={product}
        variante={seleccionada}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
