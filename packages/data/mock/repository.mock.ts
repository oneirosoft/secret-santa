import type { IRepository } from "../abstractions";
import type { Workshop } from '@secret-santa/prelude/workshop'
import type { Pneumonic } from "@secret-santa/prelude/pneumonic";
import Result, { type ResultType } from '@secret-santa/prelude/result'

const _workshops: Workshop[] = []

const repository: IRepository<Workshop, Pneumonic> = {
    save: (value: Workshop) => {
        _workshops.push(value)
        return Result.success(value)
    },
    find: (id: Pneumonic): ResultType<Workshop> => {
        const value = _workshops.find(w => w.id.value === id.value)
        return value ? Result.success(value) : Result.error(`Workshop ${id} was not found`)
    },
    all: () => Result.success(_workshops),
    delete: (id: Pneumonic): ResultType<Workshop> => {
        const index = _workshops.findIndex(w => w.id === id)
        if (index === -1) return Result.error(`Workshop ${id} was not found`)
        const value = _workshops[index]!
        _workshops.splice(index, 1)
        return Result.success(value)
    }
}

export default repository