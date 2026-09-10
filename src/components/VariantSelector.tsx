"use client";

import { useState } from "react";
import { Product, formatCOP } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

// Mapa de nombres de color -> valor CSS, para mostrar un punto de color junto
// al nombre cuando la variante representa un color (ej. Veladora No. 1).
// Si el nombre de la variante no está en este mapa (ej. "Grande", "1 Libra"),
// simplemente no se muestra el punto.
const COLOR_SWATCHES: Record<string, string> = {
  blanco: "#FFFFFF",
  "azul marino": "#1B2A6B",
  celeste: "#7EC8E3",
  amarillo: "#F2C230",
  verde: "#1F5C3A",
  rojo: "#C21F26",
  naranja: "#E8731A",
  rosado: "#F0A8C4",
  morado: "#5B2A86",
  negro: "#111111",
  azul: "#2453A6",
};

export default function VariantSelector({ product }: { product: Product }) {
  const variantes = product.variantes ?? [];
  const [seleccionada, setSeleccionada] = useState(variantes[0]);

  if (variantes.length === 0) {
    return <AddToCartButton product={product} className="w-full sm:w-auto" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => {
          const swatch = COLOR_SWATCHES[v.nombre.trim().toLowerCase()];
          return (
            <button
              key={v.id}
              onClick={() => setSeleccionada(v)}
              className={`btn-pill inline-flex items-center gap-2 border-ink/40 text-sm text-ink/70 hover:border-ink hover:text-ink ${
                seleccionada?.id === v.id ? "bg-ink text-white" : ""
              }`}
            >
              {swatch && (
                <span
                  className="h-3 w-3 rounded-full border border-ink/20"
                  style={{ backgroundColor: swatch }}
                  aria-hidden="true"
                />
              )}
              {v.nombre}
            </button>
          );
        })}
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
