import type { IRepository } from "../abstractions";
import type { WorkshopType, PneumonicType } from '@secret-santa/domain'
import Result, { type ResultType } from '@secret-santa/prelude/result'

const _workshops: WorkshopType[] = []

const repository: IRepository<WorkshopType, PneumonicType> = {
    save: (value: WorkshopType) => {
        _workshops.push(value)
        return Result.success(value)
    },
    find: (id: PneumonicType): ResultType<WorkshopType> => {
        const value = _workshops.find(w => w.id.value === id.value)
        return value ? Result.success(value) : Result.error(`Workshop ${id} was not found`)
    },
    all: () => Result.success(_workshops),
    delete: (id: PneumonicType): ResultType<WorkshopType> => {
        const index = _workshops.findIndex(w => w.id === id)
        if (index === -1) return Result.error(`Workshop ${id} was not found`)
        const value = _workshops[index]!
        _workshops.splice(index, 1)
        return Result.success(value)
    }
}

export default repository