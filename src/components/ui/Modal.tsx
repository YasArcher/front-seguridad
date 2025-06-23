import type { FC } from "react";
import type { ModalProps } from "./types/ModalProps";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className, // Nueva prop para clases adicionales
}) => {
  if (!isOpen) return null;

  return (
    <div className={twMerge("fixed inset-0 z-50 overflow-y-auto", className)}>
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={twMerge(
            "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all",
            `${sizeClasses[size]} w-full mx-auto`
          )}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="relative overflow-hidden whitespace-nowrap w-full mr-4">
                  <div className="inline-block animate-pingpong text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </div>
                </div>
                <Button
                  label=""
                  iconLeft={<X size={20} />}
                  variant="text"
                  onClick={onClose}
                  size="sm"
                  className="hover:bg-gray-100 rounded-full"
                  aria-label="Close modal"
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;