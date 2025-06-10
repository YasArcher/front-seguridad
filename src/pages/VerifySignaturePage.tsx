import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { verifySignatureService } from "../services/fileService";
import UploadFileModal from "../components/ui/UploadFileModal";

const VerificarFirmaPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { token } = useAuth();

  const handleUploadFile = async (file: File) => {
    try {
      setIsUploadModalOpen(false);

      // 🔄 Ejecutar verificación automática al subir archivo
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }
      const result = await verifySignatureService(file, token);

      if (result.valid) {
        toast.success("✔ Firma válida: " + result.message);
      } else {
        toast.error("✘ Firma inválida: " + (result.error || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error al verificar la firma:", err);
      toast.error("Error al verificar la firma.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Verificación de Firma Digital" />

      <ContentContainer>
        <div className="flex justify-end">
          <Button
            label="Subir Archivo para Verificar"
            variant="primary"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </div>
      </ContentContainer>

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFile}
      />
    </div>
  );
};

export default VerificarFirmaPage;
