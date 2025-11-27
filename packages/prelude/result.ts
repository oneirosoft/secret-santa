export type Success<T> = {
    readonly value: T;
};

export type Error = {
    readonly message: string;
};

export type ResultType<T> = Success<T> | Error;

const isSuccess = <T>(value: ResultType<T>): value is Success<T> =>
    "value" in value;

const success = <T>(value: T): Success<T> => ({ value });
const error = (message: string): Error => ({ message });
const then =
    <T, R>(fn: (value: T) => ResultType<R>) =>
        (result: ResultType<T>) =>
            isSuccess(result) ? fn(result.value) : error(result.message);

export default {
    success,
    error,
    then,
    isSuccess,
};
