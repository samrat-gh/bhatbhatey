import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";

export const getAuthSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await getAuthSession();
  console.log("sessoin", session);
  if (!session?.user.name) {
    return undefined;
  }
  return session.user;
};
