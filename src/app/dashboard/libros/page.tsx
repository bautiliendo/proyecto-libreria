'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  anio: number;
  stock: number;
};


const ListaLibros: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Obtener los libros desde la API
    const fetchLibros = async () => {
      try {
        const res = await fetch('/api/libros');
        if (res.ok) {
          const data = await res.json();
          setLibros(data);
        } else {
          console.error("Error al obtener los libros");
        }
      } catch (error) {
        console.error("Hubo un error:", error);
      }
    };
    fetchLibros();
  }, []);

  const librosFiltrados = libros.filter((libro) =>
    libro.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/libros', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Actualizar el estado local según el stock restante
        setLibros((prevLibros) =>
          prevLibros.map((libro) =>
            libro.id === id
              ? { ...libro, stock: libro.stock > 1 ? libro.stock - 1 : 0 }
              : libro
          ).filter((libro) => libro.stock !== 0)
        );
      } else {
        console.error("Error al eliminar el libro");
      }
    } catch (error) {
      console.error("Hubo un error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Lista de Libros</h2>

      <input
        type="text"
        placeholder="Buscar libro por título..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-4">
        {librosFiltrados.length > 0 ? (
          librosFiltrados.map((libro) => (
            <div
              key={libro.id}
              className="p-4 border border-gray-200 rounded shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold">{libro.titulo}</h3>
              <p className="text-gray-600">Autor: {libro.autor}</p>
              <p className="text-gray-600">Género: {libro.genero}</p>
              <p className="text-gray-600">Año: {libro.anio}</p>
              <p className="text-gray-600">Stock: {libro.stock}</p>
              <button
                onClick={() => handleDelete(libro.id)}
                className="bg-red-300 rounded px-2 py-1 my-2">Eliminar</button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No se encontraron libros.</p>
        )}
      </div>
    </div>
  );
};

export default ListaLibros;
