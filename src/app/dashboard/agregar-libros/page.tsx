'use client'

import React, { useState } from "react";

const AgregarLibroForm: React.FC = () => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [anio, setanio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoLibro = { titulo, autor, genero, anio: parseInt(anio) };

    try {
      const res = await fetch("/api/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoLibro),
      });

      if (!res.ok) throw new Error("Error al agregar el libro");

      alert("Libro agregado con éxito");
      setTitulo("");
      setAutor("");
      setGenero("");
      setanio("");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al agregar el libro");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Agregar Libro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Título del libro</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Autor</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Género</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Año</label>
          <input
            type="number"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={anio}
            onChange={(e) => setanio(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
        >
          Agregar Libro
        </button>
      </form>
    </div>
  );
};

export default AgregarLibroForm;
