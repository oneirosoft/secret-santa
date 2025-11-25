import { message } from "@secret-santa/prelude";

export type Success<T> = {
    readonly value: T;
}

export type Error = {
    readonly message: string
}

export type ResultType<T> =
    | Success<T>
    | Error


const success = <T>(value: T): Success<T> => ({ value })
const error = (message: string): Error => ({ message })

const isSuccess = <T>(value: ResultType<T>): value is Success<T> =>
    'value' in value

export default {
    success,
    error,
    isSuccess
}