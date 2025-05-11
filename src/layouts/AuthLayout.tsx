import type { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
    <div className="w-full max-w-md">
      {/* Logo o ícono de la aplicación */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <line x1="3" x2="21" y1="9" y2="9"></line>
            <line x1="9" x2="9" y1="21" y2="9"></line>
          </svg>
        </div>
      </div>
      
      {/* Contenedor del formulario */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Los Sapos. Todos los derechos reservados.
      </div>
    </div>
  </div>
);

export default AuthLayout;