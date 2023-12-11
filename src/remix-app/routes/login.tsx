import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
	const fomrData = await request.formData();
	const data = Object.fromEntries(fomrData.entries());
	console.log(data);
	return json({});
};

export default function Login() {
	return (
		<div>
			<h2>Sign in</h2>
			<Form method="post">
				<div>
					<label>
						Email
						<input type="email" name="email" />
					</label>
				</div>
				<div>
					<label>
						Password
						<input type="password" name="password" />
					</label>
				</div>
				<button type="submit">Sign in</button>
			</Form>
		</div>
	);
}
