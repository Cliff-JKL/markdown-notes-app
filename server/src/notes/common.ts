import { writeFile } from 'node:fs/promises';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';

export const createFile = async (data: string): Promise<string> => {
  const fileName = `note-markdown-${randomUUID()}.md`;
  const filePath = `src/static/notes/${fileName}`;
  try {
    console.log(`Creating markdown file...`);
    await writeFile(filePath, data);
  } catch (err) {
    console.error('Create file pipeline failed!', err);
    return '';
  }
  console.log('Create file pipeline successful!');
  return fileName;
};

export const updateFile = async (
  filePath: string,
  content: string,
): Promise<boolean> => {
  try {
    console.log('Updating markdown file...');
    await writeFile(filePath, content);
  } catch (err) {
    console.error('Update file pipeline failed!', err);
    return false;
  }
  return true;
};

export const getTimeStampFromObjectId = (objectId: string) => {
  const timeStamp = parseInt(objectId.substring(0, 8), 16) * 1000;
  return new Date(timeStamp);
};

export const createObjectIdFromIsoDateFormat = (isoDate: string) => {
  const timeStamp = new Date(isoDate).getTime() / 1000;
  return new ObjectId(timeStamp.toString(16) + 1e16);
};
