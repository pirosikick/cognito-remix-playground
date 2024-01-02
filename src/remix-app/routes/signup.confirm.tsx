import {
	type ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { confirmSignUp } from "../signup/confirmSignUp.server";
import { getSignUpSession } from "../signup/session.server";

const FormDataSchema = z.object({
	code: z.string().min(6),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSignUpSession(request.headers.get("Cookie"));
	return session.has("username") ? null : redirect("/signup");
};

export default function SignUpConfirmPage() {
	const data = useActionData<typeof action>();

	return (
		<div>
			<h2>Confirm sign-up</h2>
			{data?.errorCode && <p>{data.errorCode}</p>}
			<Form method="post">
				<div>
					<label>
						Code
						<input type="text" name="code" />
					</label>
				</div>
				<div>
					<button type="submit">Confirm</button>
				</div>
			</Form>
		</div>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSignUpSession(request.headers.get("Cookie"));
	if (!session.has("username")) {
		return redirect("/signup");
	}
	const username = session.get("username");

	const formData = await request.formData();
	const rawData = Object.fromEntries(formData.entries());
	const validationResult = FormDataSchema.safeParse(rawData);
	if (!validationResult.success) {
		return json({ errorCode: "InvalidData" });
	}
	const data = validationResult.data;
	const result = await confirmSignUp({
		username,
		code: data.code,
	});
	if (!result.success) {
		return json({ errorCode: result.value.code });
	}

	return redirect("/signup/done");
};
