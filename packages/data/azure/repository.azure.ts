import type { IRepository } from "../abstractions";
import type { WorkshopType, PneumonicType } from "@secret-santa/domain";
import { Result } from "@secret-santa/prelude";
import { TableClient, type TableEntity } from "@azure/data-tables";

type AzureTableConfig = {
    readonly connectionString: string;
    readonly tableName: string;
};

type WorkshopEntity = TableEntity & {
    readonly partitionKey: string;
    readonly rowKey: string;
    readonly data: string;
};

const toEntity = (workshop: WorkshopType): WorkshopEntity => ({
    partitionKey: "workshop",
    rowKey: workshop.id.value,
    data: JSON.stringify(workshop),
});

const fromEntity = (entity: WorkshopEntity): WorkshopType =>
    JSON.parse(entity.data) as WorkshopType;

const createTableClient = (config: AzureTableConfig): TableClient =>
    new TableClient(config.connectionString, config.tableName);

export const createRepository = (
    config: AzureTableConfig,
): IRepository<WorkshopType, PneumonicType> => {
    const client = createTableClient(config);

    return {
        save: async (value: WorkshopType) => {
            try {
                const entity = toEntity(value);
                await client.upsertEntity(entity, "Replace");
                return Result.success(value);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return Result.error<WorkshopType>(
                    `Failed to save workshop: ${message}`,
                );
            }
        },

        find: async (id: PneumonicType) => {
            try {
                const entity = await client.getEntity<WorkshopEntity>(
                    "workshop",
                    id.value,
                );
                const workshop = fromEntity(entity);
                return Result.success(workshop);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return Result.error<WorkshopType>(
                    `Workshop ${id} was not found: ${message}`,
                );
            }
        },

        all: async () => {
            try {
                const entities = client.listEntities<WorkshopEntity>({
                    queryOptions: { filter: `PartitionKey eq 'workshop'` },
                });
                const workshops: WorkshopType[] = [];
                for await (const entity of entities) {
                    workshops.push(fromEntity(entity));
                }
                return Result.success(workshops);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return Result.error<WorkshopType[]>(
                    `Failed to retrieve workshops: ${message}`,
                );
            }
        },

        delete: async (id: PneumonicType) => {
            try {
                const entity = await client.getEntity<WorkshopEntity>(
                    "workshop",
                    id.value,
                );
                const workshop = fromEntity(entity);
                await client.deleteEntity("workshop", id.value);
                return Result.success(workshop);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return Result.error<WorkshopType>(
                    `Workshop ${id} was not found: ${message}`,
                );
            }
        },
    };
};
