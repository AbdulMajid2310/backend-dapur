export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export const createResponse = <T>(message: string, data: T): ApiResponse<T> => {
  return {
    message,
    data,
  };
};