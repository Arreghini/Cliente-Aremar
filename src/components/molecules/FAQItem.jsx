import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-mar-claro py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center font-semibold text-mar-profundo hover:text-playa-sol"
      >
        {question}
        <span className="text-xl">{isOpen ? '-' : '+'}</span>
      </button>

      {isOpen && (
        <p className="mt-2 text-neutral-oscuro font-body">{answer}</p>
      )}
    </div>
  );
};

export default FAQItem;
