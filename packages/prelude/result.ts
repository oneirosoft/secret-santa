type ResultBase<T> = {
  then: <R>(fn: (value: T) => ResultType<R> | R) => ResultType<R>;
  match: <R>(some: (value: T) => R, error: (error: Error) => R) => R;
  isSuccess: () => boolean;
};

export type Success<T> = {
  readonly type: "success";
  readonly value: T;
};

export type Error = {
  readonly type: "error";
  readonly message: string;
};

export type ResultType<T> = (Success<T> | Error) & ResultBase<T>;

const isSuccess = <T>(value: ResultType<T>): value is Success<T> & ResultBase<T> =>
  value.type === "success";

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

const match =
  <T, R>(some: (value: T) => R, error: (error: Error) => R) =>
  (result: ResultType<T>) =>
    isSuccess(result) ? some(result.value) : error(result);

const wrap = <T>(result: Success<T> | Error): ResultType<T> => ({
  ...result,
  then: <R>(fn: (value: T) => ResultType<R> | R) => then(fn)(wrap(result)),
  match: <R>(onSuccess: (value: T) => R, onError: (error: Error) => R) =>
    match(onSuccess, onError)(wrap(result)),
  isSuccess: () => result.type === "success",
});

const success = <T>(value: T): ResultType<T> =>
  wrap({ type: "success" as const, value });
const error = (message: string): ResultType<never> =>
  wrap({ type: "error" as const, message });

export default {
  success,
  error,
  then,
  isSuccess,
  match,
};
