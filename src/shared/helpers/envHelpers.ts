import {
  envsPlugin,
  commonEnvs,
  devEnvs,
  prodEnvs,
  testEnvs,
} from "../../infrastructure/adapters/envs.plugin";

export const getEnvsByEnvironment = () => {
  const environment = envsPlugin.NODE_ENV;
  switch (environment) {
    case "production":
      return {
        ...prodEnvs,
        ...commonEnvs,
      };
    case "development": {
      return {
        ...devEnvs,
        ...commonEnvs,
      };
    }

    case "test": {
      return {
        ...testEnvs,
        ...commonEnvs,
      };
    }
    default:
      return {
        ...devEnvs,
        ...commonEnvs,
      };
  }
};
