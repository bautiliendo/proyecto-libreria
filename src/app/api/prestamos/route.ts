import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { libroId, nombreEstudiante, fechaInicio, fechaDevolucion } =
      await req.json();

    // Buscar el libro
    const libro = await prisma.libro.findUnique({
      where: { id: libroId },
    });

    if (!libro) {
      return new Response("El libro no existe", { status: 404 });
    }

    // Verificar si hay stock disponible
    if (libro.stock <= 0) {
      return new Response("No hay stock disponible para este libro", {
        status: 400,
      });
    }

    // Registrar el préstamo
    const nuevoPrestamo = await prisma.prestamo.create({
      data: {
        nombreEstudiante,
        fechaInicio: new Date(fechaInicio),
        fechaDevolucion: fechaDevolucion ? new Date(fechaDevolucion) : null,
        libroId,
      },
    });

    // Reducir el stock del libro en 1
    await prisma.libro.update({
      where: { id: libroId },
      data: { stock: libro.stock - 1 },
    });

    return new Response(JSON.stringify(nuevoPrestamo), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error al registrar el préstamo", { status: 500 });
  }
}


export async function GET(req: Request) {
    try {
      // Primero, obtengamos todos los préstamos sin filtro
      const prestamos = await prisma.prestamo.findMany({
        include: {
          libro: true,
        },
      });
      
      console.log("Préstamos encontrados:", prestamos); // Para debug
      
      return Response.json(prestamos, { status: 200 });
    } catch (error) {
      console.error("Error detallado:", error);
      return new Response("Error al obtener los préstamos", { status: 500 });
    }
}