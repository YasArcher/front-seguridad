import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import { verifySignatureService } from "../services/fileService";

const VerificarFirmaPage = () => {
  const [hash, setHash] = useState("");
  const [signature, setSignature] = useState("");
  const { token } = useAuth();

  const handleVerify = async () => {
  if (!hash || !signature || !token) {
    toast.error("Debes ingresar el hash y la firma para verificar.");
    return;
  }

  try {
    const result = await verifySignatureService(hash, signature, token);

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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hash del archivo (hexadecimal)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Ej. d2f3a123..."
              value={hash}
              onChange={(e) => setHash(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Firma digital (hexadecimal)
            </label>
            <textarea
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Pega aquí la firma generada desde el frontend..."
              value={signature}
              rows={4}
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button label="Verificar Firma" onClick={handleVerify} />
          </div>
      
      </ContentContainer>
    </div>
  );
};

export default VerificarFirmaPage;
