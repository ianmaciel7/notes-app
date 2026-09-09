import { GoogleAuth } from "google-auth-library";

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

export async function getGoogleCloudAccessToken() {
  const token = await new GoogleAuth({ scopes: [CLOUD_PLATFORM_SCOPE] }).getAccessToken();
  if (!token) throw new Error("Google Cloud access token is unavailable.");
  return token;
}
