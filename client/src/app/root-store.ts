import { tagsStore } from 'entities/tags';
import { authStore } from 'entities/auth';
import { notesStore } from 'entities/notes';

class RootStore {
  tags = tagsStore;
  notes = notesStore;
  auth = authStore;

  constructor() {}
}

export default RootStore;
