import { makeAutoObservable, runInAction } from 'mobx';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  Note,
  updateNote,
  Tag,
} from 'shared/api';
import { CreateNote, UpdateNote } from 'shared/api';
import { Order } from 'shared/constants';

class NotesStore {
  // notes?: IPromiseBasedObservable<GetNote[]>;
  notes: Note[] = [];
  isLoading = false;
  currentPage = 0;
  currentLimit = 16;
  hasNextPage = false;

  // local
  activeNote: Note = null;
  activeIndex: number = -1;
  _filteredNotes: Note[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setActiveNote = (note: Note) => {
    this.activeNote = note;
    this.activeIndex = this.notes.indexOf(note);
    console.log(`set active note: ${this.notes.indexOf(note)}`);
  };

  get activeNoteIndex() {
    console.log(`active note index: ${this.activeIndex}`);
    return this.activeIndex;
  }

  updateActiveNoteAction = (data: UpdateNote, tags: Tag[] = null) => {
    runInAction(() => {
      if (data.text) {
        this.activeNote.text = data.text;
      }
      if (data.fields) {
        if (data.fields.title) this.activeNote.title = data.fields.title;
      }
      if (tags) {
        this.activeNote.tags = tags;
      }
      this.activeNote.lastUpdated = data.lastUpdated;
    });
  };

  setFilteredNotes = (searchText: string, searchTag: string) => {
    if (searchText) {
      const filter = searchText.toLowerCase();

      this._filteredNotes = this.notes.filter((note) => {
        return (
          note.title.toLowerCase().includes(filter) ||
          note.text.toLowerCase().includes(filter) ||
          note.tags.some((tag) => tag.name.toLowerCase().includes(filter))
        );
      });
      return;
    }

    if (searchTag) {
      this._filteredNotes = this.notes.filter((note) =>
        note.tags.some((tag) => tag.name === searchTag),
      );
      return;
    }

    this._filteredNotes = [...this.notes];
  };

  get filteredNotes() {
    // return this._filteredNotes.length ? this._filteredNotes : this.notes;
    return this._filteredNotes;
  }

  get notesCount() {
    return this.notes.length;
  }

  getNotesAction = async (
    page: number = 1,
    limit: number = 75,
    order: Order = Order.DESC,
  ) => {
    // const res = fromPromise(getAllNotesAsync(page, limit, this.authToken));
    try {
      this.isLoading = true;
      const res = await getNotes(page, limit, order);

      runInAction(() => {
        this.notes = res.data;
        this.setFilteredNotes('', '');
        this.currentPage = res.meta.page;
        this.currentLimit = res.meta.take;
        this.hasNextPage = res.meta.hasNextPage;

        this.activeNote = res.data.length ? res.data[0] : null;
        this.activeIndex = res.data.length ? 0 : -1;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  fetchNextPage = async (limit: number = 16, order: Order = Order.DESC) => {
    try {
      if (!this.hasNextPage) {
        return;
      }

      this.isLoading = true;
      const res = await getNotes(this.currentPage + 1, limit, order);

      runInAction(() => {
        this.notes = this.notes.concat(res.data);
        this.currentPage = res.meta.page;
        this.hasNextPage = res.meta.hasNextPage;
        this.currentLimit = res.meta.take;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  createEmptyNoteAction = async (
    title: string = `Untitled`,
    text: string = `# Untitled\n\n`,
    tags: string[] = [],
  ): Promise<Note | null> => {
    try {
      const createdNote: CreateNote = {
        title: title,
        text: text,
        tags: tags,
        lastUpdated: new Date().toISOString(),
      };
      this.isLoading = true;
      const res = await createNote(createdNote);

      // TODO: add interface for createItem
      const newNote = await getNote(res._id);

      runInAction(() => {
        this.notes.unshift(newNote);
        this.activeNote = newNote;
        this.activeIndex = 0;
        this.isLoading = false;
      });

      return newNote;
    } catch {
      this.isLoading = false;
      return null;
    }
  };

  updateNoteAction = async (id: string, updatedNote: UpdateNote) => {
    try {
      console.log('DEBOUNCE');
      this.isLoading = true;
      await updateNote(id, updatedNote);

      const newNote = await getNote(id);

      runInAction(() => {
        this.notes.splice(
          this.notes.findIndex((item) => item.id === newNote.id),
          1,
        );
        this.notes.unshift(newNote);
        // this.setActiveNote(newNote);
        this.activeNote = newNote;
        this.activeIndex = 0;
        // TODO: Rewrite... Do I need this ?
        // this.notes = this.notes.map((note) => {
        //   if (note.id !== newNote.id) return note;
        //   else return newNote;
        // });

        // this.activeNote = newNote;
        this.isLoading = false;
      });
    } catch {
      this.isLoading = false;
    }
  };

  deleteNoteAction = async (id: string) => {
    try {
      this.isLoading = true;
      const note = this.notes.find((nt) => nt.id === id);
      await deleteNote(note);

      runInAction(() => {
        const index = this.notes.indexOf(note);
        this.notes.splice(index, 1);
        if (!this.notes.length) {
          this.activeNote = null;
          this.activeIndex = -1;
          return;
        }
        if (index === 0) {
          this.activeNote = this.notes[0];
          this.activeIndex = 0;
        } else {
          this.activeNote = this.notes[index - 1];
          this.activeIndex = index - 1;
        }
      });
    } catch {
      this.isLoading = false;
    }
  };
}

export default new NotesStore();
