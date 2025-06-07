import { PDFDocument } from 'pdf-lib-with-encrypt';

interface EncryptionOptions {
  userPassword?: string;
  ownerPassword?: string;
  permissions?: {
    printing?: 'lowResolution' | 'highResolution';
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
    contentAccessibility?: boolean;
    documentAssembly?: boolean;
  };
}

interface SaveOptionsWithEncryption {
  userPassword?: string;
  ownerPassword?: string;
  permissions?: EncryptionOptions['permissions'];
  useObjectStreams?: boolean;
  addDefaultPage?: boolean;
  objectsPerTick?: number;
}

export async function addPasswordToPdf(
  inputPdfBytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(inputPdfBytes);
    
    // Opciones de guardado con encriptación
    const saveOptions: SaveOptionsWithEncryption = {
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false,
      },
    };

    const protectedPdfBytes = await pdfDoc.save(saveOptions);
    return protectedPdfBytes;
  } catch (error) {
    console.error('Error al proteger el PDF:', error);
    throw new Error(`Failed to add password to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Función alternativa con más opciones de configuración
export async function addPasswordToPdfAdvanced(
  inputPdfBytes: Uint8Array,
  userPassword: string,
  ownerPassword?: string,
  customPermissions?: EncryptionOptions['permissions']
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(inputPdfBytes);
    
    const saveOptions: SaveOptionsWithEncryption = {
      userPassword: userPassword,
      ownerPassword: ownerPassword || userPassword,
      permissions: customPermissions || {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true, // Permitir accesibilidad por defecto
        documentAssembly: false,
      },
    };

    const protectedPdfBytes = await pdfDoc.save(saveOptions);
    return protectedPdfBytes;
  } catch (error) {
    console.error('Error al proteger el PDF:', error);
    throw new Error(`Failed to add password to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}