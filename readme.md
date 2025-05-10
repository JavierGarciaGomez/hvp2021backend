Push to heroku

git push heroku ts-migration:master
git push heroku ts-full-update:main

commissionable-service
CommissionableService

## approach for creating new endpoints

domain/entities
infrastructure/db/mongo/models
application/dtos
application/use-cases
domain/datasources
domain/repositories
infrastructure/datasources
infrastructure/repositories
application/services
presentation/controllers
application/factories
presentation/routes
mainRoutes.ts
presentation/appRoutes.ts

├── application
│ ├── dtos
│ │ ├── activity-register.dto.ts
│ │ ├── base.dto.ts
│ │ ├── base-option.dto.ts
│ │ ├── collaborator.dto.ts
│ │ ├── controlled-prescription.dto.ts
│ │ ├── index.ts
│ │ ├── missing-product.dto.ts
│ │ ├── notification.dto.ts
│ │ ├── product.dto.ts
│ │ ├── shared
│ │ └── supplier.dto.ts
│ ├── factories
│ │ ├── activity-register.factory.ts
│ │ ├── activity-register-type.factory.ts
│ │ ├── create-collaborator-service.factory.ts
│ │ ├── create-controlled-prescription-service.factory.ts
│ │ ├── create-notification-service.factory.ts
│ │ ├── index.ts
│ │ ├── missing-product.factory.ts
│ │ ├── product.factory.ts
│ │ └── supplier.factory.ts
│ ├── index.ts
│ ├── services
│ │ ├── activity-register.service.ts
│ │ ├── activity-register-type.service.ts
│ │ ├── base.service.ts
│ │ ├── collaborator.service.ts
│ │ ├── controlled-prescription.service.ts
│ │ ├── index.ts
│ │ ├── missing-product.service.ts
│ │ ├── notification.service.ts
│ │ ├── product.service.ts
│ │ ├── response-formatter.service.ts
│ │ └── supplier.service.ts
│ └── use-cases
│ └── index.ts
├── app.ts
├── domain
│ ├── datasources
│ │ ├── activity-register.datasource.ts
│ │ ├── activity-register-type.datasource.ts
│ │ ├── base.datasource.ts
│ │ ├── collaborator.datasource.ts
│ │ ├── controlled-prescription.datasource.ts
│ │ ├── index.ts
│ │ ├── missing-product.datasource.ts
│ │ ├── notification.datasource.ts
│ │ ├── product.datasource.ts
│ │ └── supplier.datasource.ts
│ ├── dtos
│ │ ├── attendanceRecords
│ │ ├── billCreationInfo
│ │ ├── collaboratorAuth
│ │ ├── customerRFCs
│ │ ├── index.ts
│ │ ├── tasks
│ │ ├── timeOffRequests
│ │ └── workLogs
│ ├── entities
│ │ ├── activity-register.entity.ts
│ │ ├── base.entity.ts
│ │ ├── branch.entity.ts
│ │ ├── collaborator.entity.ts
│ │ ├── controlled-prescription.entity.ts
│ │ ├── index.ts
│ │ ├── missing-product.entity.ts
│ │ ├── notification.entity.ts
│ │ ├── product.entity.ts
│ │ ├── supplier.entity.ts
│ │ ├── time-off-request.ts
│ │ └── user.entity.ts
│ ├── enums
│ │ ├── collaborator.enum.ts
│ │ ├── controlled-prescriptions.enum.ts
│ │ ├── index.ts
│ │ ├── notification.enums.ts
│ │ └── user.enums.ts
│ ├── index.ts
│ ├── repositories
│ │ ├── activity-register.repository.ts
│ │ ├── activity-register-type.repository.ts
│ │ ├── base.repository.ts
│ │ ├── collaborator.repository.ts
│ │ ├── controlled-prescription.repository.ts
│ │ ├── index.ts
│ │ ├── missing-product.repository.ts
│ │ ├── notification.repository.ts
│ │ ├── product.repository.ts
│ │ └── supplier.repository.ts
│ └── value-objects
│ ├── activity-register-type.vo.ts
│ ├── base-option.vo.ts
│ ├── base.vo.ts
│ ├── email.value-object.ts
│ └── index.ts
├── infrastructure
│ ├── adapters
│ │ ├── bcrypt.adapter.ts
│ │ ├── cookie-session.adapter.ts
│ │ ├── cors-adapter.ts
│ │ ├── dayjsConfig.ts
│ │ ├── envs.plugin.ts
│ │ ├── index.ts
│ │ ├── jwt.adapter.ts
│ │ └── passport.adapter.ts
│ ├── datasources
│ │ ├── activity-register.datasource.mongo-imp.ts
│ │ ├── activity-register-type.datasource.mongo-imp.ts
│ │ ├── base.datasource.mongo-imp.ts
│ │ ├── collaborator.datasource.mongo-imp.ts
│ │ ├── controlled-prescription.datasource.mongo-imp.ts
│ │ ├── index.ts
│ │ ├── missing-product.datasource.mongo-imp.ts
│ │ ├── notification.datasource.mongo-imp.ts
│ │ ├── product.datasource.mongo-imp.ts
│ │ └── supplier.datasource.mongo-imp.ts
│ ├── db
│ │ ├── index.ts
│ │ └── mongo
│ ├── index.ts
│ └── repositories
│ ├── activity-register.repository.imp.ts
│ ├── activity-register-type.repository.imp.ts
│ ├── base.repository.imp.ts
│ ├── collaborator.repository.imp.ts
│ ├── controlled-prescription.repository.imp.ts
│ ├── index.ts
│ ├── missing-product.repository.imp.ts
│ ├── notification.repository.imp.ts
│ ├── product.repository.imp.ts
│ └── supplier.repository.imp.ts
├── mainRoutes.ts
├── performance.test.ts
├── presentation
│ ├── appRoutes.ts
│ ├── controllers
│ │ ├── activity-register.controller.ts
│ │ ├── activity-register-type.controller.ts
│ │ ├── base.controller.ts
│ │ ├── collaborator.controller.ts
│ │ ├── controlled-prescription.controller.ts
│ │ ├── index.ts
│ │ ├── missing-product.controller.ts
│ │ ├── notification.controller.ts
│ │ ├── product.controller.ts
│ │ └── supplier.controller.ts
│ ├── middlewares
│ │ ├── attachBaseUrl.middleware.ts
│ │ ├── auth.middleware.ts
│ │ ├── errorHandler.ts
│ │ ├── index.ts
│ │ ├── isAuthorized.ts
│ │ ├── owner-or-admin.middleare.ts
│ │ ├── printRoute.middleware.ts
│ │ └── validateJwt.ts
│ ├── resources
│ │ ├── attendanceRecords
│ │ ├── auth
│ │ ├── authActivities
│ │ ├── billing
│ │ ├── tasks
│ │ ├── timeOffRequests
│ │ └── workLogs
│ ├── routes
│ │ ├── activity-register.routes.ts
│ │ ├── activity-register-type.routes.ts
│ │ ├── base-crud.routes.ts
│ │ ├── collaborator.routes.ts
│ │ ├── controlled-prescription.routes.ts
│ │ ├── index.ts
│ │ ├── missing-product.routes.ts
│ │ ├── notification.routes.ts
│ │ ├── product.routes.ts
│ │ └── supplier.routes.ts
│ ├── server.ts
│ └── services
│ ├── DeprecatedResponseFormatter.ts
│ ├── EmailService.ts
│ └── SuccessResponseFormatter.ts
└── shared
├── constants
│ ├── billingConstants.ts
│ └── index.ts
├── enums
│ ├── index.ts
│ └── status.codes.enum.ts
├── errors
│ ├── BaseError.ts
│ └── index.ts
├── experimental
│ └── aTsFile.ts
├── helpers
│ ├── addressesHelpers.ts
│ ├── authorizationHelpers.ts
│ ├── billingHelpers.test.ts
│ ├── billingHelpers.ts
│ ├── branchHelpers.ts
│ ├── collaboratorsHelpers.ts
│ ├── dateHelpers.ts
│ ├── dbhelpers.ts
│ ├── envHelpers.ts
│ ├── errors.helpers.ts
│ ├── fetchHelpers.ts
│ ├── index.ts
│ ├── infrastructure-helpers
│ ├── miscHelpers.ts
│ ├── options.helpers.ts
│ ├── queryHelpers.ts
│ ├── regexHelpers.ts
│ ├── responseHelpers.ts
│ ├── taskHelpers.ts
│ ├── throwErrorResponse.ts
│ ├── timeOffHelpers.test.ts
│ ├── timeOffHelpers.ts
│ └── validator.helpers.ts
├── index.ts
├── interfaces
│ ├── attendanceRecordType.ts
│ ├── attendanceTypes.ts
│ ├── authActivityTypes.ts
│ ├── authTypes.ts
│ ├── billingTypes.ts
│ ├── branch.ts
│ ├── index.ts
│ ├── IOption.ts
│ ├── Options.ts
│ ├── Queries.ts
│ ├── queryOptions.ts
│ ├── RequestsAndResponses.ts
│ ├── responses.ts
│ ├── taskTypes.ts
│ ├── timeOffTypes.ts
│ └── workLogsTypes.ts
└── middlewares
├── attachBaseUrl.middleware.ts
├── errorHandler.middleware.ts
├── index.ts
└── printRoute.middleware.ts
