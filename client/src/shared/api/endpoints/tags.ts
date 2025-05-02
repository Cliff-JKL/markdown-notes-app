import { CreateTag, GetTag, Tag, UpdateTag } from '../models';
import { apiInstance } from 'shared/config';

export const getTags = async (): Promise<Tag[]> => {
  return await apiInstance.get<Tag[]>('tags');
};

// FIXME redo
export const getTagsById = async (ids: string[]): Promise<Tag[]> => {
  const res = await apiInstance.get<Tag[]>('tags');
  return res.filter((tg) => ids.includes(tg.id));
};

export const getTag = async (id: string): Promise<Tag> => {
  const res = await apiInstance.get<GetTag>(`tags/${id}`);

  return {
    id: res.id,
    name: res.name,
  };
};

export const createTag = async (tag: CreateTag): Promise<any> => {
  return await apiInstance.post('tags', tag);
};

export const updateTag = async (id: string, tag: UpdateTag) => {
  return await apiInstance.patch(`tags/${id}`, tag);
};

export const deleteTag = async (tag: Tag) => {
  return await apiInstance.delete(`tags/${tag.id}`);
};
