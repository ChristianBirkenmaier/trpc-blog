import jwt from "jsonwebtoken";

// in a real world production setting, one should use a private/public key function instead of a secret
// as it is way more secure, but also more complex. For this tutorial, a secret based signing function
// must do it.

const SECRET = process.env.SECRET || "changeme";

export function signJwt(data: object) {
  return jwt.sign(data, SECRET);
}

export function verifyJwt<T>(token: string) {
  return jwt.verify(token, SECRET) as T;
}
