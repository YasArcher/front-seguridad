// utils/hash.ts

// Función mejorada para convertir base64 a ArrayBuffer con validación
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  try {
    // Limpiar el string base64 de espacios y saltos de línea
    const cleanBase64 = base64.replace(/\s/g, '');
    
    // Validar que el string base64 solo contenga caracteres válidos
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      throw new Error('Invalid base64 string format');
    }
    
    const binary = atob(cleanBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return bytes.buffer;
  } catch (error) {
    console.error('Error converting base64 to ArrayBuffer:', error);
    throw new Error('Failed to decode base64 string');
  }
};

// Función para limpiar clave PEM y extraer solo el contenido base64
const extractBase64FromPEM = (pemString: string): string => {
  return pemString
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .trim();
};

export async function calculateSHA256HashHex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signHashHex(hashHex: string): Promise<string> {
  try {
    const hashBytes = Uint8Array.from(
      hashHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
    );

    const pemPrivateKey = import.meta.env.VITE_SIGNATURE_SECRET_KEY;

    // Extraer solo el contenido base64
    const base64Key = extractBase64FromPEM(pemPrivateKey);
    
    // Convertir a ArrayBuffer
    const keyBuffer = base64ToArrayBuffer(base64Key);
    
    // Importar la clave privada
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

    // ✅ Firmar
    const signatureBuffer = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      privateKey,
      hashBytes
    );

    return Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
      
  } catch (error) {
    console.error('Error signing hash:', error);
    throw new Error(`Failed to sign hash: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Función alternativa si tienes la clave en formato JWK
export async function signHashHexWithJWK(hashHex: string, jwkPrivateKey: JsonWebKey): Promise<string> {
  try {
    const hashBytes = Uint8Array.from(
      hashHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
    );

    const privateKey = await crypto.subtle.importKey(
      "jwk",
      jwkPrivateKey,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      privateKey,
      hashBytes
    );

    return Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
      
  } catch (error) {
    console.error('Error signing with JWK:', error);
    throw new Error(`Failed to sign hash with JWK: ${error instanceof Error ? error.message : String(error)}`);
  }
}