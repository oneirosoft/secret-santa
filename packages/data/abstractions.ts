import type { ResultType } from "./result";

export interface IRepository<T, TId> {
    save: (value: T) => ResultType<T>;
    find: (id: TId) => ResultType<T>;
    all: () => ResultType<T[]>;
    delete: (id: TId) => ResultType<T>;
};
