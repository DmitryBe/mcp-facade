import { jwtDecode, JwtPayload } from "jwt-decode";
import { getAccessRules } from "../db/queries";

type Jwt = {
  user_id?: string;
  scope?: string;
} & JwtPayload;

export function getJwt(headers: Headers): Jwt | undefined {
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

export async function checkAccess(
  toolName: string,
  jwt: Jwt
): Promise<boolean> {
  const rules = await getAccessRules(toolName);
  if (rules.length === 0) {
    return true;
  }

  for (const rule of rules) {
    switch (rule.ruleType) {
      case "WILDCARD":
        return true;
      case "USER_ID":
        const allowedIds = rule.value?.split(",").map((id) => id.trim());
        if (jwt.user_id && allowedIds?.includes(jwt.user_id)) return true;
        break;
      case "SCOPE":
        const requiredScopes = rule.value?.split(",").map((id) => id.trim());
        const scopes = jwt.scope?.split(/\s+/);
        if (
          requiredScopes &&
          scopes &&
          requiredScopes.every((scope) => scopes.includes(scope))
        ) {
          return true;
        }
        break;
    }
  }

  return false;
}
