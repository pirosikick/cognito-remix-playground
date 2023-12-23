export interface Success<T> {
	success: true;
	value: T;
}

export interface Failure<Code extends string> {
	success: false;
	value: {
		code: Code;
		cause: unknown;
	};
}

export type Result<T, Code extends string = string> =
	| Success<T>
	| Failure<Code>;
