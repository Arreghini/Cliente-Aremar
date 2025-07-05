import React from 'react';
import FAQList from '../organisms/FAQList';

const FaqPage = () => {
  return (
    <div className="pt-24 px-6 min-h-screen bg-neutral-oscuro">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-mar-claro">
        <h1 className="text-3xl font-heading text-mar-profundo mb-6">Preguntas Frecuentes</h1>
        <FAQList />
      </div>
    </div>
  );
};

export default FaqPage;
