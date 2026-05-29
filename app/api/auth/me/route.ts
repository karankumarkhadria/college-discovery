import { getSessionUser } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getSessionUser();
    return ok({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
