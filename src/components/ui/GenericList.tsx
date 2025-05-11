import type { GenericListProps } from "./types/GenericListProps";

const GenericList = <T,>({
  items,
  isLoading = false,
  emptyMessage = "No se encontraron elementos.",
  className = "",
  renderItem,
  showCounter = true,
}: GenericListProps<T>) => {
  return (
    <div className={`flex flex-col h-full ${className}`} style={{ height: "calc(100vh - 240px)" }}>
      {/* Estado de Carga */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <>
          {/* Lista de elementos */}
          <div
            className="space-y-4 overflow-y-auto px-4 flex-grow"
            style={{ maxHeight: "calc(100vh - 300px)" }} 
          >
            {items.length > 0 ? (
              items.map(renderItem)
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <p className="mt-2 font-medium">{emptyMessage}</p>
              </div>
            )}
          </div>

          {/* Contador de resultados */}
          {showCounter && (
            <div className="mt-4 pt-3 px-4 text-sm text-gray-500 border-t">
              {items.length} {items.length === 1 ? "elemento encontrado" : "elementos encontrados"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenericList;