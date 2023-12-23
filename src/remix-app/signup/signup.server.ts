import { createHmac } from "crypto";
import {
	CognitoIdentityProviderClient,
	InvalidPasswordException,
	SignUpCommand,
	SignUpCommandOutput,
	UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv, fromIni } from "@aws-sdk/credential-providers";
import { z } from "zod";
import type { Result } from "~/shared";

const EnvSchema = z.object({
	USERPOOL_CLIENT_ID: z.string(),
	USERPOOL_CLIENT_SECRET: z.string(),
});

export interface SignUpOptions {
	email: string;
	password: string;
}
export type SignUpResultValue =
	| {
			userConfirmed: true;
	  }
	| {
			userConfirmed: false;
			codeDeliveryDetails: {
				attributeName: string;
				deliveryMedium: "EMAIL" | "SMS";
				destination: string;
			};
	  };
export type SignUpErrorCode =
	| "UsernameExists"
	| "InvalidPassword"
	| "ClientFailed"
	| "UnexpectedOutput";
export type SignUpResult = Result<SignUpResultValue, SignUpErrorCode>;
export const signUp = async ({
	email,
	password,
}: SignUpOptions): Promise<SignUpResult> => {
	const { USERPOOL_CLIENT_ID: clientId, USERPOOL_CLIENT_SECRET: clientSecret } =
		EnvSchema.parse(process.env);

	const client = new CognitoIdentityProviderClient({
		credentials: process.env.AWS_PROFILE
			? fromIni({
					profile: process.env.AWS_PROFILE,
			  })
			: fromEnv(),
	});
	const hmac = createHmac("sha256", clientSecret);
	hmac.update(email + clientId);
	const secretHash = hmac.digest("base64");

	let output: SignUpCommandOutput;
	try {
		output = await client.send(
			new SignUpCommand({
				ClientId: clientId,
				SecretHash: secretHash,
				Username: email,
				Password: password,
				UserAttributes: [{ Name: "email", Value: email }],
			}),
		);
	} catch (cause) {
		const value = (() => {
			if (cause instanceof UsernameExistsException) {
				return { code: "UsernameExists" as const, cause };
			}
			if (cause instanceof InvalidPasswordException) {
				return { code: "InvalidPassword" as const, cause };
			}
			return { code: "ClientFailed" as const, cause };
		})();

		return { success: false, value };
	}

	if (output.UserConfirmed) {
		return { success: true, value: { userConfirmed: true } };
	}

	if (
		!output.CodeDeliveryDetails?.AttributeName ||
		!output.CodeDeliveryDetails?.DeliveryMedium ||
		!output.CodeDeliveryDetails?.Destination
	) {
		return {
			success: false,
			value: {
				code: "UnexpectedOutput",
				cause: output,
			},
		};
	}

	return {
		success: true,
		value: {
			userConfirmed: false,
			codeDeliveryDetails: {
				attributeName: output.CodeDeliveryDetails.AttributeName,
				deliveryMedium: output.CodeDeliveryDetails.DeliveryMedium,
				destination: output.CodeDeliveryDetails.Destination,
			},
		},
	};
};
