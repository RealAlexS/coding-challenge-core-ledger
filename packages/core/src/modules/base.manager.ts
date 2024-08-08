import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { BaseRepository } from "./base.repository";
import { InferInsertModel } from "drizzle-orm";

export const baseManager = <
  TModel extends PgTable & { id: PgColumn },
  TRepo extends InstanceType<ReturnType<typeof BaseRepository<TModel>>>
>(
  repo: TRepo,
  events: any
) => {

  const wrapper = () => repo.db.select().from(repo.model);
  type fromType = ReturnType<typeof wrapper>;
  return new (class {
    model = repo.model;
    async get(id: string) {
      return repo.get(id);
    }
    async create(item: InferInsertModel<TModel>) {
      const newItem = await repo.create(item);
      await events.Created.publish(newItem);
      return newItem;
    }
    async update(id: string, item: InferInsertModel<TModel>) {
      // Broadcast to events.Updated if required
      return repo.update(id, item);
    }
    async list(params ?: (query: fromType) => fromType) {
      return repo.list(params);
    }
    async delete(id: string) {
      return repo.delete(id);
    }
    async upsert(item: InferInsertModel<TModel>, version: number) {
      return repo.upsert(item, version);
    }
    async query(by: PgColumn, value: any) {
      return repo.query(by, value);
    }
    async getBy(by: PgColumn, id: string) {
      return repo.getBy(by, id);
    }
  })();
};
