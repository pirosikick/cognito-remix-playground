import {
	CodeMismatchException,
	ConfirmSignUpCommand,
	ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";
import { z } from "zod";
import {
	type Result,
	createSecretHash,
	getCognitoIdentityProviderClient,
} from "~/shared";

const EnvSchema = z.object({
	USERPOOL_CLIENT_ID: z.string(),
	USERPOOL_CLIENT_SECRET: z.string(),
});

export interface ConfirmSignUpOptions {
	username: string;
	code: string;
}
export type ConfirmSignUpErrorCode = "CodeMismatch" | "ExpiredCode" | "Unknown";
export type ConfirmSignUpResult = Result<void, ConfirmSignUpErrorCode>;
export const confirmSignUp = async ({
	username,
	code,
}: ConfirmSignUpOptions): Promise<ConfirmSignUpResult> => {
	const { USERPOOL_CLIENT_ID: clientId, USERPOOL_CLIENT_SECRET: clientSecret } =
		EnvSchema.parse(process.env);

	const client = getCognitoIdentityProviderClient();
	try {
		await client.send(
			new ConfirmSignUpCommand({
				ClientId: clientId,
				SecretHash: createSecretHash({
					clientId,
					clientSecret,
					username,
				}),
				Username: username,
				ConfirmationCode: code,
			}),
		);
	} catch (error) {
		const errorCode: ConfirmSignUpErrorCode = (() => {
			if (error instanceof CodeMismatchException) {
				return "CodeMismatch";
			}
			if (error instanceof ExpiredCodeException) {
				return "ExpiredCode";
			}
			return "Unknown";
		})();

		return {
			success: false,
			value: { code: errorCode, cause: error },
		};
	}

	return { success: true, value: undefined };
};
