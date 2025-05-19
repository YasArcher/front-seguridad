// Tipo para el Payload del JWT
export interface JwtPayload {
  user_id: number;
  email: string;
  role: string;
  exp: number;
}
