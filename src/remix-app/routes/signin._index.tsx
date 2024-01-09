import {
	Button,
	Container,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";

export default function SignInPage() {
	return (
		<Container>
			<Stack spacing={6}>
				<Heading>Sign in</Heading>
				<Form method="post">
					<Stack spacing={4}>
						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input type="email" name="email" />
						</FormControl>
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input type="password" name="password" />
						</FormControl>
						<Button type="submit">Sign in</Button>
					</Stack>
				</Form>
			</Stack>
		</Container>
	);
}
