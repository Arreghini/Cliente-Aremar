import { useState } from 'react';
import PropTypes from 'prop-types';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className="w-full max-w-3xl min-w-[768px] mx-auto bg-white p-8 rounded-2xl shadow-md border border-mar-claro transition-all duration-300">
      <button
        onClick={toggleOpen}
        className="w-full text-left flex justify-between items-center font-semibold text-mar-profundo hover:text-playa-sol"
      >
        <span className="flex-1">{question}</span>
        <span aria-hidden="true" className="text-xl ml-4 w-6 text-center">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: isOpen ? '500px' : '0' }}
      >
        <p className="mt-2 text-neutral-oscuro font-body">{answer}</p>
      </div>
    </div>
  );
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default FAQItem;
