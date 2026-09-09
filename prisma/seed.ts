// Puebla la base de datos con productos de muestra (mismos que se veían en
// el sitio original de Shopify). Se ejecuta con: npx prisma db seed
//
// Es seguro correrlo varias veces: usa upsert por slug, así que no duplica
// productos si ya existen.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productos = [
  {
    slug: "cirio-pascual-libra",
    nombre: "Cirio Pascual de Libra",
    referencia: "B-00036",
    descripcion:
      "Cirio pascual decorado con cruz y símbolos alfa/omega, ideal para celebraciones litúrgicas y ceremonias especiales.",
    precioBase: 41606,
    imagen: "/productos/cirio-pascual-libra.jpg",
    categoriaSlug: "velas-iluminacion",
    destacado: true,
    variantes: [
      { nombre: "1 Libra", precio: 41606 },
      { nombre: "2 Libras", precio: 70006 },
    ],
  },
  {
    slug: "cirio-pascual-ii-libras",
    nombre: "Cirio Pascual II Libras",
    referencia: "B-00037",
    descripcion:
      "Cirio pascual grande con motivos religiosos pintados a mano: cruz, uvas, cáliz y símbolos pascuales.",
    precioBase: 70006,
    imagen: "/productos/cirio-pascual-ii.jpg",
    categoriaSlug: "velas-iluminacion",
    destacado: true,
    variantes: [],
  },
  {
    slug: "cubre-vela",
    nombre: "Cubre Vela",
    descripcion:
      "Farol decorativo en metal calado, protege la llama y aporta un ambiente cálido a cualquier espacio.",
    precioBase: 45000,
    imagen: "/productos/cubre-vela.jpg",
    categoriaSlug: "velas-iluminacion",
    destacado: true,
    variantes: [],
  },
  {
    slug: "vela-acanalada-grande",
    nombre: "Vela Acanalada Grande",
    referencia: "B-00012",
    descripcion:
      "Set de velas acanaladas artesanales, perfectas para decoración de mesa o rituales de oración.",
    precioBase: 10295,
    imagen: "/productos/vela-acanalada.jpg",
    categoriaSlug: "velas-iluminacion",
    destacado: true,
    variantes: [
      { nombre: "Azul", precio: 10295 },
      { nombre: "Blanco", precio: 10295 },
      { nombre: "Rojo", precio: 10295 },
    ],
  },
  {
    slug: "vela-aromatizada-lavanda",
    nombre: "Vela Aromatizada Lavanda",
    descripcion:
      "Ambienta tus espacios con nuestras fragancias más exclusivas. Elaborada con cera de soya y aceites esenciales.",
    precioBase: 38000,
    imagen: "/productos/vela-aromatizada.jpg",
    categoriaSlug: "aromaterapia-espiritual",
    destacado: true,
    variantes: [],
  },
  {
    slug: "imagen-virgen-maria",
    nombre: "Imagen Virgen María",
    descripcion:
      "Figura religiosa de altar, elaborada en resina con acabado fino, ideal para el hogar o como regalo.",
    precioBase: 89000,
    imagen: "/productos/virgen-maria.jpg",
    categoriaSlug: "arte-religioso",
    destacado: false,
    variantes: [],
  },
  {
    slug: "kit-higiene-natural",
    nombre: "Kit Higiene y Bienestar Natural",
    descripcion:
      "Jabones artesanales y aceites naturales para el cuidado personal, elaborados con ingredientes naturales.",
    precioBase: 52000,
    imagen: "/productos/kit-higiene.jpg",
    categoriaSlug: "higiene-bienestar",
    destacado: false,
    variantes: [],
  },
];

async function main() {
  for (const p of productos) {
    const { variantes, ...datos } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...datos,
        variantes: { create: variantes },
      },
    });
  }
  console.log(`Sembrados ${productos.length} productos de muestra.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
