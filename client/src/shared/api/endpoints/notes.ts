import { apiInstance } from 'shared/config';
import { CreateNote, GetNote, Note, Page, UpdateNote } from '../models';
import { getMarkdown } from './files';
import { Order } from 'shared/constants';

export const createNote = async (note: CreateNote): Promise<any> => {
  return await apiInstance.post(`notes`, note);
};

export const getNote = async (id: string): Promise<Note> => {
  const res = await apiInstance.get<GetNote>(`notes/${id}`);

  const content = await getMarkdown(res.file);

  return {
    id: res.id,
    title: res.title,
    file: res.file,
    text: content,
    tags: res.tags.map((tg) => {
      return { id: tg._id, name: tg.name };
    }),
    lastUpdated: res.lastUpdated,
  };
};

export const getNotes = async (
  page: number = 1,
  limit: number = 16,
  order: Order = Order.DESC,
): Promise<Page<Note>> => {
  const res = await apiInstance.get<Page<GetNote>>(
    `notes?take=${limit}&page=${page}&order=${order}`,
  );

  const items = res.data;

  //TODO: parallel requests ?
  await Promise.all(
    items.map(async (item) => {
      const content = await getMarkdown(item.file);
      item.text = content;
    }),
  );

  return {
    data: items.map((nt) => {
      return {
        id: nt.id,
        title: nt.title,
        text: nt.text,
        file: nt.file,
        tags: nt.tags.map((tg) => {
          return { id: tg._id, name: tg.name };
        }),
        lastUpdated: nt.lastUpdated,
      };
    }),
    meta: res.meta,
  };
};

export const updateNote = async (id: string, note: UpdateNote) => {
  return await apiInstance.patch(`notes/${id}`, note);
};

export const deleteNote = async (note: Note) => {
  return await apiInstance.delete(`notes/${note.id}`);
};
