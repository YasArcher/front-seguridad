import React from 'react';

export interface ButtonProps {
  /** Texto del botón */
  label: string;
  /** Función a ejecutar cuando se hace clic en el botón */
  onClick: () => void;
  /** Variante visual del botón */
  variant?: 'primary' | 'secondary' | 'danger' | 'text' | 'success' | 'warning' | 'info' | 'dark' | 'light' | 'link' | 'outline';
  /** Tamaño del botón */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Si el botón está deshabilitado */
  disabled?: boolean;
  /** Si el botón ocupa todo el ancho disponible */
  fullWidth?: boolean;
  /** Clases personalizadas adicionales */
  className?: string;
  /** Icono a mostrar a la izquierda del texto */
  iconLeft?: React.ReactNode;
  /** Icono a mostrar a la derecha del texto */
  iconRight?: React.ReactNode;
  /** Si el botón está en estado de carga */
  loading?: boolean;
  /** Nivel de redondeo de las esquinas */
  rounded?: 'none' | 'default' | 'md' | 'lg' | 'xl' | 'full';
}