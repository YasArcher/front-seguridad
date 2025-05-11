import type { FC } from 'react';
import { useState } from 'react';
import type { UserPermissionsModalProps } from './types/UserPermissionsModalProps';
import Modal from './Modal';
import Button from './Button';

const UserPermissionsModal: FC<UserPermissionsModalProps> = ({
  isOpen,
  onClose,
  fileName,
  users,
  onAddUser,
  onRemoveUser,
  onGenerateReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Usuarios permitidos al archivo ${fileName}`}
      size="lg"
    >
      <div className="flex flex-col space-y-6">
        {/* Header actions */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Button 
              label="Generar informe" 
              variant="primary" 
              onClick={onGenerateReport}
              iconLeft={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <Button 
              label="Añadir usuario" 
              variant="primary" 
              onClick={() => onAddUser('')}
              iconLeft={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
            />
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-64 lg:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 transition-all duration-200"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* User list */}
        <div className="flex-grow overflow-y-auto space-y-4 max-h-96">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row border border-gray-700
                  hover:border-gray-600 transition-colors duration-200"
              >
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-lg flex-shrink-0 
                  mr-0 sm:mr-4 mb-4 sm:mb-0 flex items-center justify-center text-gray-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                {/* User details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-white">{user.name}</h3>
                  <p className="text-gray-400 mt-1 text-sm">{user.description}</p>
                  
                  <div className="flex flex-wrap mt-3 gap-x-8 gap-y-2">
                    {user.downloadCount !== undefined && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-400">Descargas</p>
                          <p className="font-medium text-white">{user.downloadCount}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.lastDownload && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-400">Última descarga</p>
                          <p className="font-medium text-white">{user.lastDownload}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-start ml-auto mt-4 sm:mt-0">
                  <Button
                    label="Quitar permiso"
                    variant="danger"
                    size="sm"
                    onClick={() => onRemoveUser(user.id)}
                    iconLeft={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-400">
                No se encontraron usuarios que coincidan con la búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserPermissionsModal;