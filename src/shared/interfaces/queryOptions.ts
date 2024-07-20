import { FilteringDto } from "../../application/dtos/shared/filtering.dto";
import { PaginationDto, SortingDto } from "../../domain";

export interface CustomQueryOptions {
  paginationDto: PaginationDto;
  sortingDto: SortingDto;
  filteringDto: FilteringDto;
}
