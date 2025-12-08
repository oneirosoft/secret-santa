import type { IRepository } from "../abstractions";
import type { WorkshopType, PneumonicType } from "@secret-santa/domain";
import { Result } from "@secret-santa/prelude";

const _workshopStore = (() => {
    const workshops = new Map<string, WorkshopType>();
    return {
        add: (workshop: WorkshopType) => workshops.set(workshop.id.value, workshop),
        remove: (id: PneumonicType) => workshops.delete(id.value),
        get: (id: PneumonicType) => workshops.get(id.value),
        all: () => workshops.values(),
    };
})();

const repository: IRepository<WorkshopType, PneumonicType> = {
    save: (value: WorkshopType) => {
        _workshopStore.add(value);
        return Promise.resolve(Result.success(value));
    },
    find: (id: PneumonicType) => {
        const value = _workshopStore.get(id);
        console.log(value)
        const result = value
            ? Result.success(value)
            : Result.error<WorkshopType>(`Workshop ${id} was not found`);
        return Promise.resolve(result);
    },
    all: () => Promise.resolve(Result.success([..._workshopStore.all()])),
    delete: (id: PneumonicType) => {
        const value = _workshopStore.get(id);
        if (!value)
            return Promise.resolve(
                Result.error<WorkshopType>(`Workshop ${id} was not found`),
            );
        _workshopStore.remove(id);
        return Promise.resolve(Result.success(value));
    },
};

export default repository;
