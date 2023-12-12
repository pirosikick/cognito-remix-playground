import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
	const fomrData = await request.formData();
	const data = Object.fromEntries(fomrData.entries());
	await new Promise((resolve) => setTimeout(resolve, 3000));
	console.log(data);
	return json({});
};

export default function Login() {
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";

	return (
		<div>
			<h2>Sign in</h2>
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
					Sign in
				</button>
			</Form>
		</div>
	);
}
