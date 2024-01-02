import { randomUUID } from "crypto";
import { createMemorySessionStorage } from "@remix-run/node";

export const {
	getSession: getSignUpSession,
	commitSession: commitSignUpSession,
	destroySession: destroySignUpSession,
} = createMemorySessionStorage({
	cookie: {
		name: "signUpSession",
		secrets: [randomUUID()],
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	},
});
