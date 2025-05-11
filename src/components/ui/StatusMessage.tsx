import { useState } from 'react';
import type { FC } from 'react';
import type { StatusMessageProps } from './types/StatusMessageProps';

const StatusMessage: FC<StatusMessageProps> = ({
  isLoading = false,
  error = null,
  empty = false,
  emptyMessage = "No se encontraron archivos.",
  children
}) => {
  const [showModal, setShowModal] = useState(isLoading || !!error || empty);

  const handleClose = () => setShowModal(false);

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-500"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    if (empty) {
      return (
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-4 font-medium">{emptyMessage}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center">
            {renderModalContent()}
            <button
              onClick={handleClose}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      {!showModal && children}
    </>
  );
};

export default StatusMessage;