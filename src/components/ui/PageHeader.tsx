import type { FC } from 'react';
import type { PageHeaderProps } from './types/PageHeaderProps';

const PageHeader: FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  breadcrumbs,
  children, 
  variant = 'default' 
}) => {
  // Configuración de clases según la variante
  const headerPadding = {
    default: 'px-6 py-6',
    compact: 'px-4 py-3',
    large: 'px-8 py-8'
  };

  const titleSize = {
    default: 'text-2xl md:text-3xl',
    compact: 'text-xl md:text-2xl',
    large: 'text-3xl md:text-4xl'
  };

  return (
    <div className={`bg-gradient-to-r from-gray-900 to-gray-800 ${headerPadding[variant]} rounded-lg shadow-md mb-6`}>
      {/* Migas de pan si están presentes */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-500">/</span>}
              {crumb.path ? (
                <a href={crumb.path} className="hover:text-amber-400 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-300">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contenido principal del encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Lado izquierdo con título, subtítulo e icono opcional */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-amber-400 p-2 bg-gray-800/50 rounded-lg">
              {icon}
            </div>
          )}
          
          <div>
            <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 ${titleSize[variant]}`}>
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-gray-400 mt-1 text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Lado derecho con acciones/children */}
        {children && (
          <div className="flex flex-wrap items-center gap-2 sm:mt-0 mt-2 w-full sm:w-auto justify-end">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;