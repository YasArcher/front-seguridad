import { useEffect, useState, useMemo } from "react";
import SearchBar from "../components/ui/SearchBar";
import GenericList from "../components/ui/GenericList";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import { useFiles } from "../hooks/useFiles";
import { toast } from "react-toastify";
import FileCard from "../components/ui/FileCard";
import DocumentViewerModal from "../components/ui/DocumentViewerModal";

const GestionArchivos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  const handleViewFile = async (
    blob: Blob,
    file: { title: string },
    mime: string
  ) => {
    setIsViewerOpen(true);
    setViewerLoading(true);

    const url = URL.createObjectURL(blob);
    setFileUrl(url);
    setFileName(file.title);
    setMimeType(mime);
  };
  const handleBeforeViewFile = (file: { title: string }) => {
    setFileName(file.title);
    setMimeType(null);
    setFileUrl(null);
    setIsViewerOpen(true);
    setViewerLoading(true);
  };

  // @ts-ignore
  const { files, searchFiles, loading, error } = useFiles(
    "basic",
    undefined,
    handleViewFile,
    handleBeforeViewFile
  );

  const filteredFiles = useMemo(
    () => searchFiles(searchTerm),
    [searchTerm, searchFiles]
  );

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

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
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setViewerLoading(false); // 👈 Reiniciamos
          if (fileUrl) URL.revokeObjectURL(fileUrl);
          setFileUrl(null);
          setMimeType(null);
        }}
        fileUrl={fileUrl || ""}
        fileName={fileName || "Documento"}
        mimeType={mimeType || ""}
      />
    </div>
  );
};

export default GestionArchivos;