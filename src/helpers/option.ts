export interface Option<T> {
	_tag: 'Some' | 'None';
	value?: T;

	map<U>(f: (value: T) => U): Option<U>;
	getOrElse(defaultValue: T): T;
	apply(f: (value: T) => void): void;
	isSome(): boolean;
}

export class Some<T> implements Option<T> {
	_tag: 'Some' = 'Some';
	value: T;

	constructor(value: T) {
		this.value = value;
	}

	map<U>(f: (value: T) => U): Option<U> {
		return new Some(f(this.value));
	}

	getOrElse(_: T): T {
		return this.value;
	}

	apply(f: (value: T) => void): void {
		f(this.value);
	}

	isSome(): boolean {
		return true;
	}
}

export class None implements Option<never> {
	_tag: 'None' = 'None';

	map<U>(_: (value: never) => U): Option<U> {
		return new None();
	}

	getOrElse<T>(defaultValue: T): T {
		return defaultValue;
	}

	apply(_: (value: never) => void): void {
		// Do nothing
	}

	isSome(): boolean {
		return false;
	}
}

export const some = <T>(value: T): Option<T> => new Some(value);
export const none: Option<never> = new None();
