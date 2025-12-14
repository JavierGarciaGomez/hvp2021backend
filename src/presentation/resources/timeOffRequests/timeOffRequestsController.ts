// // TODO: DELETE

// import { Response, Request, NextFunction } from "express";
// import { AuthenticatedRequest } from "../../../shared/interfaces/RequestsAndResponses";
// import { PaginationDto } from "../../../domain";
// import { TimeOffRequestsService } from "./timeOffRequestsService";
// import { TimeOffRequestDto } from "../../../domain/dtos/timeOffRequests/TimeOffRequestDto";
// import { BaseError } from "../../../shared/errors/BaseError";
// import { TimeOffRequest } from "../../../shared";

// export class TimeOffRequestController {
//   constructor(
//     private readonly timeOffRequestsService: TimeOffRequestsService
//   ) {}

//   // TODO This need to throw error to next so its catched by handleErrorMiddleware
//   private handleError = (error: unknown, res: Response, next: NextFunction) => {
//     next(error);
//   };
//   // Todo review
//   public getTimeOffRequests = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { page, limit } = req.query;
//       const paginationDto = PaginationDto.create(Number(page), Number(limit));

//       const timeOffRequestsResponse =
//         await this.timeOffRequestsService.getTimeOffRequests(paginationDto!);
//       res
//         .status(timeOffRequestsResponse.status_code)
//         .json(timeOffRequestsResponse);
//     } catch (error) {
//       this.handleError(error, res, next);
//     }
//   };

//   public getTimeOffRequestsByCollaborator = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { page, limit } = req.query;
//       const paginationDto = PaginationDto.create(Number(page), Number(limit));

//       const collaboratorId = req.params.collaboratorId;

//       const timeOffRequestsResponse =
//         await this.timeOffRequestsService.getTimeOffRequestsByCollaborator(
//           paginationDto!,
//           collaboratorId
//         );
//       res
//         .status(timeOffRequestsResponse.status_code)
//         .json(timeOffRequestsResponse);
//     } catch (error) {
//       this.handleError(error, res, next);
//     }
//   };

//   public getTimeOffRequestsByYear = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { page, limit } = req.query;
//       const paginationDto = PaginationDto.create(Number(page), Number(limit));

//       const year = req.params.year;

//       const timeOffRequestsResponse =
//         await this.timeOffRequestsService.getTimeOffRequestsByYear(
//           paginationDto!,
//           Number(year)
//         );
//       res
//         .status(timeOffRequestsResponse.status_code)
//         .json(timeOffRequestsResponse);
//     } catch (error) {
//       this.handleError(error, res, next);
//     }
//   };

//   public getTimeOffRequestById = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const id = req.params.id;
//     try {
//       const response = await this.timeOffRequestsService.getTimeOffRequestById(
//         id
//       );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       this.handleError(error, res, next);
//     }
//   };

//   public createTimeOffRequest = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { authUser } = req;
//       const body = req.body;
//       const [error, createTimeOffRequestDto] = TimeOffRequestDto.create(body);
//       if (error)
//         throw BaseError.badRequest("Invalid time off request data", error);

//       const response = await this.timeOffRequestsService.createTimeOffRequest(
//         createTimeOffRequestDto!,
//         authUser!
//       );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };

//   public updateTimeOffRequest = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const id = req.params.id;
//       const { authUser } = req;
//       const body = req.body;
//       const [error, timeOffRequestDto] = TimeOffRequestDto.update(body);

//       if (error)
//         throw BaseError.badRequest("Invalid time off request data", error);

//       const response = await this.timeOffRequestsService.updateTimeOffRequest(
//         id,
//         timeOffRequestDto!,
//         authUser!
//       );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };

//   public approveTimeOffRequest = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const id = req.params.id;
//       const { approvedBy, managerNote, status } =
//         req.body as Partial<TimeOffRequest>;

//       const response = await this.timeOffRequestsService.approveTimeOffRequest(
//         { approvedBy, managerNote, status },
//         id
//       );
//       res.status(response.status_code).json(response);
//     } catch (error) {}
//   };
//   public deleteTimeOffRequest = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const id = req.params.id;
//       const response = await this.timeOffRequestsService.deleteTimeOffRequest(
//         id
//       );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };
//   public getCollaboratorTimeOffOverview = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const endDateParam = req.query.endDate?.toString();
//       const endDate = endDateParam ? new Date(endDateParam) : new Date();

//       const collaboratorId = req.params.collaboratorId;

//       const response =
//         await this.timeOffRequestsService.getCollaboratorTimeOffOverview(
//           collaboratorId,
//           new Date(endDate)
//         );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };
//   public getCollaboratorsTimeOffOverview = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { page, limit } = req.query;
//       const paginationDto = PaginationDto.create(Number(page), Number(limit));

//       const response =
//         await this.timeOffRequestsService.getCollaboratorsTimeOffOverview(
//           paginationDto!
//         );
//       res.status(response.status_code).json(response);
//     } catch (error) {}
//   };

//   public getTimeOffRequestsByRequestedDays = async (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const { page, limit } = req.query;
//       const paginationDto = PaginationDto.create(Number(page), Number(limit));

//       const startDateParam = req.query.startDate?.toString();
//       const endDateParam = req.query.endDate?.toString();

//       if (!startDateParam || !endDateParam) {
//         throw BaseError.badRequest("Start date and end date are required");
//       }

//       const startDate = new Date(startDateParam);
//       const endDate = new Date(endDateParam);

//       const response =
//         await this.timeOffRequestsService.getTimeOffRequestsByRequestedDays(
//           paginationDto!,
//           startDate,
//           endDate
//         );
//       res.status(response.status_code).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// interface HandleRequestParams {
//   req: AuthenticatedRequest;
//   res: Response;
//   query: any;
//   operation: string;
// }
