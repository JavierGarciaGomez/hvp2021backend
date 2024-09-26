import { JobEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class JobRepository extends BaseRepository<JobEntity> {}
