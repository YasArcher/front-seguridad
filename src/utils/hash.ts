export async function calculateSHA256HashHex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signHashHex(hashHex: string, privateKey: CryptoKey): Promise<string> {
  // Convertir el hash hexadecimal a Uint8Array
  const hashBytes = Uint8Array.from(
    hashHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );

  // Firmar usando RSASSA-PKCS1-v1_5 y SHA-256
  const signatureBuffer = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5", // o "ECDSA" si usas curvas elípticas
    },
    privateKey,
    hashBytes
  );

  // Convertir firma binaria a string hexadecimal
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
