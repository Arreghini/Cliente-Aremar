import React from 'react';

const CancelationPolicy = () => {
  return (
    <div className="pt-36 bg-neutral-oscuro min-h-screen flex">
      <div className="px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6">
          Política de Cancelaciónes
        </h1>

        <p className="mb-6">
          En Aremar, entendemos que pueden surgir imprevistos. Por eso, detallamos a
          continuación nuestras condiciones para cancelar o modificar una reserva.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Condiciones Generales</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Cancelaciones con más de 14 días de anticipación:</strong> Reembolso total del monto pagado.
          </li>
          <li>
            <strong>Cancelaciones entre 7 y 14 días antes del check-in:</strong> Reembolso del 50% del valor total.
          </li>
          <li>
            <strong>Cancelaciones con menos de 7 días de anticipación:</strong> No se realizará reembolso.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">Cancelación por parte del establecimiento</h2>
        <p className="mb-4">
          En casos excepcionales (mantenimiento urgente, condiciones climáticas extremas, etc.), Aremar se reserva el derecho de cancelar una reserva, ofreciendo <strong>reubicación</strong> o <strong>reembolso completo</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Modificaciones de Reserva</h2>
        <p className="mb-4">
          Se permite reprogramar fechas con al menos 7 días de anticipación, sujeto a disponibilidad y sin costo adicional.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Proceso para Cancelar o Modificar</h2>
        <p className="mb-4">
          Para cancelar o modificar su reserva, por favor comuníquese al correo <a href="mailto:reservas@aremar.com" className="text-blue-600 hover:underline">reservas@aremar.com</a> o al WhatsApp oficial <strong>+54 9 223 000 0000</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Política de No-Show</h2>
        <p className="mb-4">
          En caso de no presentarse sin aviso previo, se considerará <strong>cancelación sin reembolso</strong>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Contacto</h2>
        <p className="mb-2">
          Si tiene alguna pregunta sobre nuestra política de cancelación, no dude en escribirnos a <a href="mailto:reservas@aremar.com" className="text-blue-600 hover:underline">reservas@aremar.com</a>.
        </p>
      </div>
    </div>
  );
};

export default CancelationPolicy;
