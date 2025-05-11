import type { FC } from 'react';
import type { StatusMessageProps } from './types/StatusMessageProps';

const StatusMessage: FC<StatusMessageProps> = ({
  isLoading = false,
  error = null,
  empty = false,
  emptyMessage = "No se encontraron archivos.",
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (empty) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
        </svg>
        <p className="mt-2 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusMessage;
