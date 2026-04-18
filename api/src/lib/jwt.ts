import { SignJWT, jwtVerify } from 'jose';

const alg = 'HS256';

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is required');
  return new TextEncoder().encode(s);
}

export async function signUserToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey());
}

export async function verifyUserToken(
  token: string,
): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, secretKey(), {
    algorithms: [alg],
  });
  const sub = payload.sub;
  if (!sub) throw new Error('Invalid token');
  return { userId: sub };
}
