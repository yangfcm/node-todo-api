import { DEFAULT_ERROR_MESSAGE } from "../config/constants";

export type AppError = {
  message: string;
  name?: string;
  errors?: Record<
    string,
    {
      name?: string;
      message?: string;
      kind?: string;
      path?: string;
      value?: string;
    }
  >;
};

function errorToJson(error: any): AppError {
  const appError: AppError = {
    message: error.message || DEFAULT_ERROR_MESSAGE,
  };
  if (error.name) appError.name = error.name;
  if (error.errors) appError.errors = error.errors;
  return appError;
}

export default errorToJson;
