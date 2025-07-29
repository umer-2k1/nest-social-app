export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  //agregar los otros datos que se quieran guardar en el token
}
