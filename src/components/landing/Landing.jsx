import React, { useState } from 'react';

const Landing = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Landing Page</h1>
            <button 
                onClick={openModal} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            >
                Open Modal
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative bg-white p-8 rounded shadow-lg max-w-3xl w-full text-center">
                        <button 
                            onClick={closeModal} 
                            className="m-4 text-xl font-bold text-gray-500 hover:text-gray-700"
                        >
                            x
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Las Toninas</h2>
                        <p className="mb-4">La elección por lo natural</p>
                        <iframe 
                            src="https://do-sol-departamentos-de-mar-apartment.hoteles-costa-atlantica-de-argentina.com/data/Images/OriginalPhoto/9474/947486/947486407/image-las-toninas-do-sol-departamentos-de-mar-apartment-6.JPEG" 
                            title="Atardecer en la playa" 
                            className="w-full h-full border-none"
                            style={{ minHeight: "640px" }}
                        ></iframe>
                        <p className="mb-4">Este es el contenido de la modal.</p>
                        <p className="mb-4">Añado más texto aquí si lo deseas.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
