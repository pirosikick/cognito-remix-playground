import { createHmac } from "crypto";

export interface CreateSecretHashOptions {
	clientId: string;
	clientSecret: string;
	username: string;
}
export const createSecretHash = ({
	clientId,
	clientSecret,
	username,
}: CreateSecretHashOptions) => {
	const hmac = createHmac("sha256", clientSecret);
	hmac.update(username + clientId);
	return hmac.digest("base64");
};
