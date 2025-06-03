import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";


export function getJwt(headers: Headers): JwtPayload | undefined {
    const authHeader =
      headers.get("authorization") || headers.get("Authorization");
  
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const decodedJwt = jwtDecode<JwtPayload>(token);
        return decodedJwt;
      } catch (e) {
        console.error("Failed to decode JWT:", e);
        return undefined;
      }
    }
  }
  