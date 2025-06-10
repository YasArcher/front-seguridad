import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { verifySignatureService } from "../services/fileService";
import UploadFileModal from "../components/ui/UploadFileModal";
import { calculateSHA256HashHex } from "../utils/hash";
const VerificarFirmaPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [hash, setHash] = useState("");
  const { token } = useAuth();

  
  const handleUploadFile = async (file: File) => {
  try {
    // Calcular hash del archivo
    const hashHex = await calculateSHA256HashHex(file);

    // Guardar el hash para usarlo en la verificación
    setHash(hashHex);

    // Mostrar feedback al usuario
    console.log("Hash del archivo:", hashHex);
    toast.success("Archivo procesado. Listo para verificar la firma.");

    // Cerrar modal
    setIsUploadModalOpen(false);
  } catch (err) {
    console.error("Error al procesar el archivo:", err);
    toast.error("Error al procesar el archivo.");
  }
};



 const handleVerify = async () => {
  if (!hash || !token) {
    toast.error("Debes cargar un archivo para verificar.");
    return;
  }

  try {
    console.log("Hash del archivo:", hash);

    const result = await verifySignatureService(hash, token);

    if (result.valid) {
      toast.success("✔ Firma válida: " + result.message);
    } else {
      toast.error("✘ Firma inválida: " + (result.error || "Error desconocido"));
    }
  } catch (err) {
    toast.error("Error al verificar la firma.");
  }
};



  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Verificación de Firma Digital" />

      <ContentContainer>
        <div className="flex justify-end mb-4">
          <Button
            label="Subir Archivo para Firmar"
            variant="primary"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hash del archivo (hexadecimal)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-white text-black"
            placeholder="Cargar archivo para generar hash..."
            value={hash}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Firma digital (hexadecimal)
          </label>
        
        </div>

        <div className="flex justify-end">
          <Button label="Verificar Firma" onClick={handleVerify} />
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
