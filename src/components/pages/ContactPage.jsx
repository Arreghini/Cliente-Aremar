import React, { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mensaje enviado:', formData);
    // Podés agregar lógica para enviar por email, API, etc.
  };

  return (
    <div className="pt-36 bg-neutral-oscuro min-h-screen flex">
      <div className="px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6">
          Contacto
        </h1>

        <p className="mb-6 font-body">
          Si tenés dudas, consultas o querés hacer una reserva directa,
          escribinos. Estamos para ayudarte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Nombre
            </label>
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
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Email
            </label>
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
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Mensaje
            </label>
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

        <div className="mt-8 text-sm font-body">
          <p>
            <strong>Teléfono:</strong> +54 9 2255 12-3456
          </p>
          <p>
            <strong>Email:</strong> info@aremar.com
          </p>
          <p>
            <strong>Dirección:</strong> Calle 42 y 1, Las Toninas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
