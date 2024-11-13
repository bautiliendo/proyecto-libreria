'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PrestamoLibroForm: React.FC = () => {
  const [nombreLibro, setNombreLibro] = useState("");
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [libros, setLibros] = useState<any[]>([]); // Para almacenar los libros disponibles
  const [libroId, setLibroId] = useState<number | null>(null); // ID del libro seleccionado
  const [prestamosActivos, setPrestamosActivos] = useState<any[]>([]);

  const router = useRouter();


  // Función para obtener los préstamos activos
  const obtenerPrestamosActivos = async () => {
    try {
      const res = await fetch("/api/prestamos");
      if (!res.ok) {
        throw new Error("Error al obtener los préstamos activos");
      }
      const data = await res.json();
      console.log("Datos recibidos del servidor:", data); // Para debug
      setPrestamosActivos(data);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      alert("Hubo un problema al cargar los préstamos activos");
    }
  };

  useEffect(() => {
    obtenerPrestamosActivos();
  }, []);

  useEffect(() => {
    const fetchLibros = async () => {
      const res = await fetch("/api/libros");
      const data = await res.json();
      setLibros(data);
    };
    fetchLibros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!libroId) {
      alert("Por favor, selecciona un libro válido.");
      return;
    }
    const nuevoPrestamo = {
      libroId,
      nombreEstudiante,
      fechaInicio,
      fechaDevolucion,
    };

    try {
      const res = await fetch("/api/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPrestamo),
      });

      if (!res.ok) throw new Error("Error al registrar el préstamo");

      alert("Préstamo registrado con éxito");
      setNombreLibro("");
      setNombreEstudiante("");
      setFechaInicio("");
      setFechaDevolucion("");
      setLibroId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al registrar el préstamo");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Registrar Préstamo de Libro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Selecciona el libro</label>
            <select
              value={libroId || ""}
              onChange={(e) => setLibroId(Number(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccione un libro</option>
              {libros.map((libro) => (
                <option
                  key={libro.id}
                  value={libro.id}
                  disabled={libro.stock <= 0}
                >
                  {libro.titulo} - {libro.autor} {libro.stock <= 0 ? '(Sin stock)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Nombre del estudiante</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={nombreEstudiante}
              onChange={(e) => setNombreEstudiante(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de inicio del préstamo</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de devolución</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
          >
            Registrar Préstamo
          </button>
        </form>


      </div>


      <div className="max-w-xl mx-auto">
        {/* Tabla de Préstamos Activos */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-green-600 justify-center text-center">Préstamos Activos</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-4 py-2 border-b">Libro</th>
              <th className="px-4 py-2 border-b">Estudiante</th>
              <th className="px-4 py-2 border-b">Fecha de Inicio</th>
              <th className="px-4 py-2 border-b">Fecha de Devolución</th>
            </tr>
          </thead>
          <tbody>
            {prestamosActivos.map((prestamo) => (
              <tr key={prestamo.id}>
                <td className="px-4 py-2 border-b">{prestamo.libro.titulo}</td>
                <td className="px-4 py-2 border-b">{prestamo.nombreEstudiante}</td>
                <td className="px-4 py-2 border-b">{new Date(prestamo.fechaInicio).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">
                  {prestamo.fechaDevolucion
                    ? new Date(prestamo.fechaDevolucion).toLocaleDateString()
                    : "Pendiente"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PrestamoLibroForm;
