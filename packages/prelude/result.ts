export type Success<T> = {
    readonly type: "success";
    readonly value: T;
};

export type Error = {
    readonly type: "error";
    readonly message: string;
};

export type ResultType<T> = Success<T> | Error;

const isSuccess = <T>(value: ResultType<T>): value is Success<T> =>
    value.type === "success";

const success = <T>(value: T): Success<T> => ({ type: "success", value });
const error = (message: string): Error => ({ type: "error", message });
const then =
    <T, R>(fn: (value: T) => ResultType<R> | R) =>
        (result: ResultType<T>): ResultType<R> => {
            if (!isSuccess(result)) return error(result.message);
            const fnResult = fn(result.value);
            return typeof fnResult === "object" &&
                fnResult !== null &&
                "type" in fnResult
                ? fnResult
                : success(fnResult);
        };

export default {
    success,
    error,
    then,
    isSuccess,
};
