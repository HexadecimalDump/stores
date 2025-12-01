import { AxiosError } from 'axios';

export const getAxiosErrorMessage = (
  error: AxiosError<{ message?: string[] }>,
) => error?.response?.data?.message?.join(',') || error?.message;
