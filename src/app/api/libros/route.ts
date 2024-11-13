// src/app/api/libros/route.ts
import prisma from "@/lib/prisma"; // Importar prisma para interactuar con la base de datos

// Manejar la solicitud POST para agregar un libro
export async function POST(req: Request) {
  try {
    const { titulo, autor, genero, anio, stock } = await req.json();

    // Verificar si ya existe un libro con el mismo título
    const libroExistente = await prisma.libro.findFirst({
      where: {
        titulo: titulo,
        autor: autor,
      },
    });

    if (libroExistente) {
      const actualizado = await prisma.libro.update({
        where: { id: libroExistente.id },
        data: {
          stock: libroExistente.stock + 1, // Incrementar stock
        },
      });
      return new Response(JSON.stringify(actualizado), { status: 200 });
    } else {
      // Si el libro no existe, crear un nuevo libro
      const nuevoLibro = await prisma.libro.create({
        data: {
          titulo,
          autor,
          genero,
          anio,
          stock,
          estado: "ACTIVO", // Estado inicial del libro
        },
      });
      return new Response(JSON.stringify(nuevoLibro), { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error al agregar el libro", { status: 500 });
  }
}

export async function GET() {
  try {
    const libros = await prisma.libro.findMany();
    return Response.json(libros);
  } catch (error) {
    console.error("Error al obtener libros:", error);
    return Response.json({ error: "Error al obtener libros" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const libro = await prisma.libro.findUnique({
      where: { id },
    });

    if (!libro) {
      return new Response("Libro no encontrado", { status: 404 });
    }

    if (libro.stock > 1) {
      const actualizado = await prisma.libro.update({
        where: { id },
        data: { stock: libro.stock - 1 },
      });
      return new Response(JSON.stringify(actualizado), { status: 200 });
    } else {
      await prisma.libro.delete({
        where: { id },
      });
      return new Response("Libro eliminado exitosamente", { status: 200 });
    }
  } catch (error) {
    console.error("Error al procesar la eliminación del libro:", error);
    return new Response("Error al eliminar el libro", { status: 500 });
  }
}
