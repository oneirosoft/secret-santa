import type { ResultType } from "@secret-santa/prelude";

type RepoResult<T> = Promise<ResultType<T>>;

export interface IRepository<T, TId> {
    save: (value: T) => RepoResult<T>;
    find: (id: TId) => RepoResult<T>;
    all: () => RepoResult<T[]>;
    delete: (id: TId) => RepoResult<T>;
}
