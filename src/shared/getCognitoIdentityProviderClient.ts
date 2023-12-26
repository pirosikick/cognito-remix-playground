import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv, fromIni } from "@aws-sdk/credential-providers";

export const getCognitoIdentityProviderClient = () => {
	return new CognitoIdentityProviderClient({
		credentials: process.env.AWS_PROFILE
			? fromIni({
					profile: process.env.AWS_PROFILE,
			  })
			: fromEnv(),
	});
};
