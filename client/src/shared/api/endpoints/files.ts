import { apiInstance } from 'shared/config';

export const getMarkdown = async (filename: string): Promise<string> => {
  return await apiInstance.get(`notes/static/${filename}`);
};
