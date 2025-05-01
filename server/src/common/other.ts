import * as bcrypt from 'bcrypt';
import { unlink } from 'node:fs';

export const hashData = (data: string): string => {
  return bcrypt.hashSync(data, 10);
};

export const cryptMatches = (value1: string, value2: string): boolean => {
  return bcrypt.compareSync(value1, value2);
};

export const removeFile = async (filepath: string): Promise<boolean> => {
  unlink(filepath, (err) => {
    if (err) {
      console.log(err);
      return false;
    }
  });
  console.log(`${filepath} was successfully deleted!`);
  return true;
};
