import { makeAutoObservable, runInAction } from 'mobx';
import {
  getTags,
  createTag,
  Tag,
  CreateTag,
  getTag,
  deleteTag,
  updateTag,
  UpdateTag,
} from 'shared/api';

class TagsStore {
  tags: Tag[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  createTagAction = async (name: string) => {
    try {
      const createdTag: CreateTag = {
        name: name,
      };

      this.isLoading = true;
      const res = await createTag(createdTag);

      const newTag = await getTag(res.id);

      runInAction(() => {
        this.tags.push(newTag);

        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  getTagsAction = async () => {
    try {
      this.isLoading = true;
      const res = await getTags();

      runInAction(() => {
        this.tags = res;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  updateTagAction = async (id: string, updatedTag: UpdateTag) => {
    try {
      this.isLoading = true;
      await updateTag(id, updatedTag);

      const newTag = await getTag(id);

      runInAction(() => {
        // TODO: rewrite
        this.tags = this.tags.map((tag) => {
          if (tag.id !== newTag.id) return tag;
          else return newTag;
        });

        // this.activeNote = newTag;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  deleteTagAction = async (id: string) => {
    try {
      this.isLoading = true;
      const tag = this.tags.find((tag) => tag.id === id);
      await deleteTag(tag);

      runInAction(() => {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };
}

export default new TagsStore();
