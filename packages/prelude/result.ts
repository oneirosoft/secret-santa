type ResultBase<T> = {
  map: <R>(fn: (value: T) => R) => ResultType<R>;
  flatMap: <R>(fn: (value: T) => ResultType<R>) => ResultType<R>;
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

export type ResultType<T = unknown> = (Success<T> | Error) & ResultBase<T>;

const isSuccess = <T>(
  value: ResultType<T>,
): value is Success<T> & ResultBase<T> => value.type === "success";

const flatMap =
  <T, R>(fn: (value: T) => ResultType<R>) =>
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

const map =
  <T, R>(fn: (value: T) => R) =>
    (result: ResultType<T>): ResultType<R> =>
      flatMap((value: T) => success(fn(value)))(result);

const wrap = <T>(result: Success<T> | Error): ResultType<T> => ({
  ...result,
  map: <R>(fn: (value: T) => R) => map(fn)(wrap(result)),
  flatMap: <R>(fn: (value: T) => ResultType<R>) => flatMap(fn)(wrap(result)),
  match: <R>(onSuccess: (value: T) => R, onError: (error: Error) => R) =>
    match(onSuccess, onError)(wrap(result)),
  isSuccess: () => result.type === "success",
});

const success = <T>(value: T): ResultType<T> =>
  wrap({ type: "success" as const, value });
const error = <T>(message: string): ResultType<T> =>
  wrap({ type: "error" as const, message });

export default {
  success,
  error,
  map,
  flatMap,
  isSuccess,
  match,
};
