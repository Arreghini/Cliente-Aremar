import React from 'react';
import FAQList from '../organisms/FAQList';

const FaqPage = () => {
  return (
    <div className="pt-36 bg-neutral-oscuro min-h-screen flex">
      <div className="px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6">
          Preguntas Frecuentes
        </h1>
        <FAQList />
      </div>
    </div>
  );
};

export default FaqPage;
