import {
	type ActionFunctionArgs,
	TypedResponse,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { signUp } from "../signup/signup.server";

const FormDataSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export interface ActionData {
	errorCode: "InvalidData" | "UsernameExists" | "Failed";
}
export const action = async ({
	request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionData>> => {
	const fomrData = await request.formData();
	const rawData = Object.fromEntries(fomrData.entries());
	const validationResult = FormDataSchema.safeParse(rawData);
	if (!validationResult.success) {
		return json({ errorCode: "InvalidData" });
	}
	const data = validationResult.data;

	const result = await signUp(data);
	if (!result.success) {
		console.log(result.value);
		return json({
			errorCode:
				result.value.code === "UsernameExists" ? "UsernameExists" : "Failed",
		});
	}

	return redirect("/signup/confirm");
};

export default function SignUpPage() {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	const actionData = useActionData<typeof action>();
	const errorCode = actionData?.errorCode;

	return (
		<div>
			<h2>Sign up</h2>
			{errorCode && <p>{errorCode}.</p>}
			<Form method="post">
				<div>
					<label>
						Email
						<input type="email" name="email" disabled={submitting} />
					</label>
				</div>
				<div>
					<label>
						Password
						<input type="password" name="password" disabled={submitting} />
					</label>
				</div>
				<button type="submit" disabled={submitting}>
					Sign up
				</button>
			</Form>
		</div>
	);
}
