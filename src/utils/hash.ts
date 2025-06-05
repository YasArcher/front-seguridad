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

    const pemPrivateKey = `-----BEGIN PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDM7o1D+pTRsceakwYIHhtHkLION9+GckeYUcdw+eb7X8Ozu7hC5TGKMg2NkwR9oM8Zk2Fz41oYrc/+1kH0HJkvuDWO9KCjcNYRgOkmkRB2xcrSJdvIt7tLiCBRwOY1T7RwP4ffh6JWJ9Gwdwz5WPg7jEx2ZYqy0ifUUDiqSNO12CnOnYkxOdg245j8itMhraFutnGuIdTUyh/+8BeUPqd8NGlWY8SoH3E8AUGhbqSD3Oqy6cKq2tApf4JqS2/dnWV+t+mcKfHapfr8UfIMm4l5pQVZfg9KbhGbzzXAzyU0JQneYgegb9ws+sfLnKnc6kPtwGxz5sAY5QXdTqpH5rFAgMBAAECggEAAOhe64u/JnN8Dg1m/K67+J/tJhKzoVm72G8R3lbQnyY/0sEOFdBQuQosAiqG+IdprVB5eE+ShAN/gCXqUFG9EnBbycs965r+p0yuDCgmfJro9OvRvnPOTxKJlqhOoTmOoPmRhPJ4cGGP3gudO0WMDRn2cxmkq97Fn+4IC/XG4wE1zoolGUdZAfAkbbVZb6OnWbaAsFjsV8zO4/EOyyajNnXyRprEU6JvMvRyqMCH+9u97xRD4ALrS8h4UDnqW+/nXr4+5Y5mv/+Nqd+/BrCKof7RuyKdR6CK3a9iFu1yX6CzN2inAweiqSskue6C3KBkfEqpb99cuWunewGD0380UQKBgQDnmH5lwNQ4lBAKn27zLp0yQOka3baal9pXqVHsxXhkLvKaEnlav0QSxOXtC9aD3c2sjcT9KgOFOKojIQl54M/iAyDA3qcMaZQV5R01F9XQJa70h5XKbUCPUvyrfEMQb7ut1v3FHqRYsuDXhuKtBdPa8Zeek+pSr+u5hryxlXvfsQKBgQDXxXt5qy2OAjie++5penNKayoIHnco0S+SrSAS2B3Le6t8NCBQjK8XTMds3VVXjuVWswPDDmaJqu/NuS4EN3kqp/cxozSp8QJDgVbIMJ61faHoQUpD3sK7+b+evnlbVYgddIFJ4bXCeEQmOPZ43NfIgLPhg0nLir4UZJ95vHXlVQKBgBwSl/+tiAvzpp4jBUfk9pkI1Ti0d1X14jmOBKg2p4k9R5r1clBVruK3i0dYkAAb+rpX1PD7DsIvRDBN6OAlKA21Y1r9ojIW+iRNSWUOJpS8fKCXbsjCxXiaDpaa0WZEpPNFhC1IsZMu26JEb2WZtzxq3H4UX+r1+BTdCDJedE2BAoGAIC31okmjO6CdLSjJf7WhaCHfXOKeRtobzDZBqE3O87/37Ugg4aJ5onHy9At2ZN6M2YdNMlP9et6hcP8DG+HiEjiGp0J94jJtcf/iH20Q3mRkNy01lDWuuTYgG96wXqy85hewCIK/BsfE8iZgq9nT3LVFHobkBJUmkAgJuLAgrRkCgYBoqhhJGx4fuy6G8kr88KPnrAWQpY1EE/5fcoKQ0L0JXSK2jPvConVCQrv9HVuth6vnDumwnpHWixiiRntpn2hQFp+/Afj6AmFTI5Fzy8WIHqk5yoCOHXVMByfEBzoUH3lNhi/Zihi4ONFUrqwIjg8XLxma+TwWEdTknJYJowIcXA==-----END PRIVATE KEY-----`;

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