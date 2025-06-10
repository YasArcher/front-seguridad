import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { verifySignatureService } from "../services/fileService";
import UploadFileModal from "../components/ui/UploadFileModal";
import { calculateSHA256HashHex } from "../utils/hash";
const API_URL = 'https://localhost/files/';
const VerificarFirmaPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [signature, setSignature] = useState("");
  const { token } = useAuth();

  
  const handleUploadFile = async (file: File) => {
  try {
    // Calcular hash del archivo
    const hashHex = await calculateSHA256HashHex(file);

    // Consultar al backend la firma guardada para ese hash
    const response = await fetch(`${API_URL}by-hash/${hashHex}`, {

      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      setHash(hashHex);
      setSignature(data.signature);  // Usar la firma que está en BD
      console.log("Firma recuperada BD:", data.signature);
      console.log("Hash del archivo BD:", hashHex);
      toast.success("Archivo procesado. Firma recuperada de la BD.");
    } else {
      toast.error(data.error || "Error al recuperar la firma desde la BD.");
    }

    setIsUploadModalOpen(false);
  } catch (err) {
    console.error("Error al procesar el archivo:", err);
    toast.error("Error al procesar el archivo.");
  }
};


  const handleVerify = async () => {
  if (!hash || !signature || !token) {
    toast.error("Debes cargar un archivo para verificar.");
    return;
  }

  try {
    // 🟢 Limpiar la firma
    const cleanSignature = signature.replace(/\s+/g, '');
    console.log("Firma limpia:", cleanSignature);
    console.log("Hash del archivo:", hash);
    const result = await verifySignatureService(hash, cleanSignature, token);

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
          <textarea
            className="w-full p-2 border rounded bg-white text-black"
            placeholder="Cargar archivo para generar firma..."
            value={signature}
            rows={4}
            readOnly
          />
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
