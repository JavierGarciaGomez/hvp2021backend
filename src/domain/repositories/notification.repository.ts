import { NotificationEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class NotificationRepository extends BaseRepository<NotificationEntity> {
  abstract createMany(
    notifications: NotificationEntity[]
  ): Promise<NotificationEntity[]>;
}
