import { calculateDurationDTO } from "../../application";
import { FilteringDto } from "../../application/dtos/shared/filtering.dto";
import { PaginationDto, SortingDto } from "../../domain";

export interface CustomQueryOptions {
  paginationDto?: PaginationDto;
  sortingDto?: SortingDto;
  calculateDurationDto?: calculateDurationDTO;
  filteringDto?: FilteringDto;
}
