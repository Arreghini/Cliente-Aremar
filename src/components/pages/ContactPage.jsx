import React, { useState } from "react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mensaje enviado:", formData);
    // Podés agregar lógica para enviar por email, API, etc.
  };

  return (
    <div className="pt-24 px-4 min-h-screen bg-neutral-oscuro">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-heading text-mar-profundo mb-4">Contacto</h1>

        <p className="text-neutral-oscuro mb-6 font-body">
          Si tenés dudas, consultas o querés hacer una reserva directa, escribinos. Estamos para ayudarte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-oscuro">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 font-body focus:outline-none focus:ring-2 focus:ring-mar-claro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-oscuro">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 font-body focus:outline-none focus:ring-2 focus:ring-mar-claro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-oscuro">Mensaje</label>
            <textarea
              name="mensaje"
              rows="4"
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 font-body focus:outline-none focus:ring-2 focus:ring-mar-claro"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-playa-sol text-white font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Enviar
          </button>
        </form>

        <div className="mt-6 text-sm text-neutral-oscuro font-body">
          <p><strong>Teléfono:</strong> +54 9 2255 12-3456</p>
          <p><strong>Email:</strong> info@aremar.com</p>
          <p><strong>Dirección:</strong> Calle 42 y 1, Las Toninas</p>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
