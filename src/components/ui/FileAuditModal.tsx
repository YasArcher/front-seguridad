import type { FC } from "react";
import { useEffect } from "react";
import Modal from "./Modal";
import { useFileActionsAudit } from "../../hooks/useFileActionsAudit";

interface FileAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileAuditModal: FC<FileAuditModalProps> = ({ isOpen, onClose}) => {
  const { logs, actions, loading, error, fetchAudit } = useFileActionsAudit();

  useEffect(() => {
    if (isOpen) fetchAudit();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Auditoría de Acciones en Archivos"
      size="lg"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto space-y-2 border p-3 rounded-lg bg-gray-50">
              {actions.length > 0 ? (
                actions.map((action, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0">
                    <div>
                      <p><span className="font-medium">{action.email}</span> ejecutó <span className="italic">{action.action}</span></p>
                      <p className="text-xs text-gray-500">{action.details}</p>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(action.timestamp).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">No hay acciones registradas</p>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">Logs de Auditoría</span>
                </div>
                <span className="text-gray-400 text-xs">{logs.length} registros</span>
              </div>
              <div className="p-4 max-h-40 overflow-y-auto">
                {logs.length > 0 ? (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="flex text-sm">
                        <span className="text-gray-500 mr-2 flex-shrink-0">
                          {String(index + 1).padStart(3, '0')}
                        </span>
                        <span className="text-green-400 font-mono break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center">No hay logs disponibles</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FileAuditModal;
