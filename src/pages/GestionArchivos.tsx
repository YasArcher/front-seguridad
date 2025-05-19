import { useEffect, useState, useMemo } from "react";
import SearchBar from "../components/ui/SearchBar";
import GenericList from "../components/ui/GenericList";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import { useFiles } from "../hooks/useFiles";
import { toast } from "react-toastify";
import FileCard from "../components/ui/FileCard";

const GestionArchivos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { files, searchFiles, loading, error } = useFiles('basic', undefined);

  const filteredFiles = useMemo(
    () => searchFiles(searchTerm),
    [searchTerm, searchFiles]
  );

  // Mostrar toast de error
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  // Mostrar toast si no hay resultados
  useEffect(() => {
    if (!loading && filteredFiles.length === 0 && searchTerm) {
      toast.info("No hay archivos que coincidan con la búsqueda.");
    }
  }, [filteredFiles, loading, searchTerm]);

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Gestión de Archivos">
        <div className="flex gap-2 items-center">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar archivos..."
          />
        </div>
      </PageHeader>

      <ContentContainer>
        <GenericList
          items={filteredFiles}
          isLoading={loading}
          emptyMessage="No hay archivos que coincidan con la búsqueda."
          renderItem={(file) => <FileCard key={file.id} {...file} />}
        />
      </ContentContainer>
    </div>
  );
};

export default GestionArchivos;
