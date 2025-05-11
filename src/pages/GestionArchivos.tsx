import { useState, useMemo } from "react";
import SearchBar from "../components/ui/SearchBar";
import GenericList from "../components/ui/GenericList";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import StatusMessage from "../components/ui/StatusMessage";
import { useFiles } from "../hooks/useFiles";
import FileCard from "../components/ui/FileCard";

const GestionArchivos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { files, searchFiles, loading, error } = useFiles();

  const filteredFiles = useMemo(
    () => searchFiles(searchTerm),
    [searchTerm, searchFiles]
  );

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
        <StatusMessage
          isLoading={loading}
          error={error}
          empty={filteredFiles.length === 0}
          emptyMessage="No hay archivos que coincidan con la búsqueda."
        >
          <GenericList
            items={filteredFiles}
            isLoading={loading}
            emptyMessage="No hay archivos que coincidan con la búsqueda."
            renderItem={(file) => <FileCard key={file.id} {...file} />}
          />
        </StatusMessage>
      </ContentContainer>
    </div>
  );
};

export default GestionArchivos;
