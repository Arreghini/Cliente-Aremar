import React from 'react';
import FAQItem from '../molecules/FAQItem';

const faqs = [
  {
    question: '¿Cómo hago una reserva?',
    answer:
      'Podés hacer una reserva desde la página de inicio seleccionando fechas y tipo de habitación.',
  },
  {
    question: '¿Se puede cancelar una reserva?',
    answer:
      'Sí, podés cancelar desde tu perfil. Consultá nuestras políticas de cancelación.',
  },
  {
    question: '¿Aceptan mascotas?',
    answer:
      'En algunos departamentos sí, según disponibilidad. Consultá antes de reservar.',
  },
];

const FAQList = () => {
  return (
    <div className="space-y-4" data-testid="faq-list-container">
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQList;
