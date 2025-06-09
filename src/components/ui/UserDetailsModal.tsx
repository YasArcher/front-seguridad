import type { FC } from "react";
import { useState } from "react";
import Modal from "./Modal";
import { useAuditData } from "../../hooks/useAuditData";

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  email: string;
};

type TabType = 'sessions' | 'files' | 'attempts' | 'logs' | 'downloads';

const UserDetailsModal: FC<UserDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  userId, 
  email 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('sessions');
  const { 
    auditLogs, 
    activeSessions, 
    uploadedFiles, 
    loginAttempts, 
    loading, 
    error, 
    refetch,
    downloadHistory
  } = useAuditData({ userId, email });

  const tabs = [
    { id: 'sessions', label: 'Sesiones', icon: '🧭', count: activeSessions.length },
    { id: 'files', label: 'Archivos', icon: '📂', count: uploadedFiles.length },
    { id: 'attempts', label: 'Login', icon: '👤', count: loginAttempts.length },
    { id: 'logs', label: 'Auditoría', icon: '📄', count: auditLogs.length },
    { id: 'downloads', label: 'Descargas', icon: '⬇️', count: downloadHistory.length },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-500 font-medium">Error al cargar datos</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
            <button 
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'sessions':
        return (
          <div className="space-y-3">
            {activeSessions.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {activeSessions.map((session, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">IP: {session.ip}</p>
                        <p className="text-sm text-gray-600">Última actividad: {session.lastActivity}</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-2">🌐</div>
                <p className="text-gray-500">No hay sesiones activas</p>
              </div>
            )}
          </div>
        );

      case 'files':
        return (
          <div className="space-y-3">
            {uploadedFiles.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border flex items-center">
                    <div className="text-blue-600 mr-3">📄</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{file}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-2">📁</div>
                <p className="text-gray-500">No se han subido archivos</p>
              </div>
            )}
          </div>
        );

      case 'attempts':
        return (
          <div className="space-y-3">
            {loginAttempts.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {loginAttempts.map((attempt, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{attempt.attemptedAt}</p>
                        <p className="text-sm text-gray-600">
                          Estado: 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            attempt.attemptedAt ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {attempt.attemptedAt ? 'Exitoso' : 'Fallido'}
                          </span>
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        attempt.attemptedAt ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-2">🔐</div>
                <p className="text-gray-500">No hay intentos de login registrados</p>
              </div>
            )}
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-3">
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
                <span className="text-gray-400 text-xs">{auditLogs.length} registros</span>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                {auditLogs.length > 0 ? (
                  <div className="space-y-1">
                    {auditLogs.map((log, index) => (
                      <div key={index} className="flex text-sm">
                        <span className="text-gray-500 mr-2 flex-shrink-0">
                          {String(index + 1).padStart(3, '0')}
                        </span>
                        <span className="text-green-400 font-mono break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-600 text-2xl mb-2">📝</div>
                    <p className="text-gray-500">No hay logs disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

        case 'downloads':
  return (
    <div className="space-y-3">
      {downloadHistory.length > 0 ? (
        <div className="max-h-80 overflow-y-auto space-y-2">
          {downloadHistory.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 border">
              <p className="font-medium text-gray-900">
                Archivo ID: {item.fileId}
              </p>
              <p className="text-sm text-gray-600">Descargado en: {item.time}</p>
              <p className="text-sm text-gray-600">IP: {item.ip}</p>
              <p className="text-sm text-gray-600">Agente: {item.userAgent}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-2">⬇️</div>
          <p className="text-gray-500">No hay descargas registradas</p>
        </div>
      )}
    </div>
  );


      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Detalles de ${email}`}>
      <div className="flex flex-col h-96">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;