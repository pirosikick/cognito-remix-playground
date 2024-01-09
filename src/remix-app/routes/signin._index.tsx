import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Form } from "@remix-run/react";

export default function SignInPage() {
	return (
		<div>
			<h2>Sign in</h2>
			<Form method="post">
				<FormControl>
					<FormLabel>Email</FormLabel>
					<Input type="email" name="email" />
				</FormControl>
				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input type="password" name="password" />
				</FormControl>
				<Button mt={4} type="submit">
					Sign in
				</Button>
			</Form>
		</div>
	);
}
