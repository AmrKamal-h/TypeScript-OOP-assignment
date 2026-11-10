class User {
  public id: number;
  protected name: string;
  protected email: string;
  protected phone: string;
  private password: string;
  private _age: number;

  private notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this._age = 0;
    this.age = age;
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  public addNotebook(notebook: NoteBook): void {
    if (this.notebooks.includes(notebook)) {
      console.log("Notebook already added");
      return;
    }
    this.notebooks.push(notebook);
    console.log(`Notebook "${notebook.name}" added to user ${this.name}`);
  }

  public removeNotebook(notebook: NoteBook): void {
    const index = this.notebooks.indexOf(notebook);
    if (index === -1) {
      console.log("Notebook not found");
      return;
    }
    this.notebooks.splice(index, 1);
    console.log(`Notebook "${notebook.name}" removed from user ${this.name}`);
  }

  public getNotebooks(): NoteBook[] {
    return [...this.notebooks];
  }

  public displayInfo(): void {
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Phone: ${this.phone}`);
    console.log(`Age: ${this.age}`);
    console.log(`Notebooks: ${this.notebooks.length}`);
  }
}

const user = new User(
  1,
  "Amr",
  "amr@example.com",
  "secret123",
  "01012345678",
  25,
);
user.displayInfo();

// Class Note
class Note {
  private static counter = 1;

  public readonly id: number;
  public title: string;
  public content: string;

  public readonly author: User;

  constructor(title: string, content: string, author: User) {
    this.id = Note.counter++;
    this.title = title;
    this.content = content;

    this.author = author;
  }

  public preview(length: number = 20): string {
    if (this.content.length <= length) {
      return this.content;
    }
    return this.content.substring(0, length) + "...";
  }

  public displayAuthor(): void {
    console.log(`Note "${this.title}" written by user #${this.author.id}`);
  }
}

class Admin extends User {
  private notes: Note[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    super(id, name, email, password, phone, age);
  }

  public manageNotes(
    action: "add" | "delete" | "display",
    value?: Note | number,
  ): void {
    switch (action) {
      case "add":
        if (!(value instanceof Note)) {
          console.log("Please provide a Note object");
          return;
        }

        if (value.author.id !== this.id) {
          console.log("This note belongs to another user");
          return;
        }
        this.notes.push(value);
        console.log(`Note added: ${value.title}`);
        break;

      case "delete": {
        const index = this.notes.findIndex((n) => n.id === value);
        if (index === -1) {
          console.log("Note not found");
          return;
        }
        const removed = this.notes.splice(index, 1);
        console.log(`Note deleted: ${removed[0]?.title}`);
        break;
      }

      case "display":
        if (this.notes.length === 0) {
          console.log("No notes yet");
          return;
        }

        this.notes.forEach((n) =>
          console.log(`#${n.id} | ${n.title}: ${n.preview()}`),
        );
        break;
    }
  }

  public displayInfo(): void {
    super.displayInfo();
    console.log(`Role: Admin`);
    console.log(`Notes count: ${this.notes.length}`);
  }
}

const admin = new Admin(
  1,
  "Amr",
  "amr@example.com",
  "secret123",
  "01012345678",
  30,
);

const note1 = new Note(
  "Task",
  "Review all the new users that registered this week",
  admin,
);
const note2 = new Note("Reminder", "Update permissions", admin);

admin.manageNotes("add", note1);
admin.manageNotes("add", note2);
admin.manageNotes("display");

console.log(note1.preview(10));

// Class NoteBook
class NoteBook {
  public readonly name: string;

  private notes: Note[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public addNote(title: string, content: string, user: User): Note {
    const note = new Note(title, content, user);
    this.notes.push(note);
    console.log(`Note added to "${this.name}": ${note.title}`);
    return note;
  }

  public removeNote(id: number): void {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      console.log("Note not found");
      return;
    }

    const [removed] = this.notes.splice(index, 1);
    if (removed) {
      console.log(`Note removed: ${removed.title}`);
    }
  }

  public displayNotes(): void {
    if (this.notes.length === 0) {
      console.log("No notes in this notebook");
      return;
    }
    this.notes.forEach((n) =>
      console.log(`#${n.id} | ${n.title}: ${n.preview()}`),
    );
  }

  public getNotes(): Note[] {
    return [...this.notes];
  }
}

const notebook = new NoteBook("Work Notes");

notebook.addNote(
  "Task",
  "Review all the new users that registered this week",
  admin,
);
const reminder = notebook.addNote("Reminder", "Update permissions", admin);

notebook.displayNotes();
notebook.removeNote(reminder.id);
notebook.displayNotes();

const workBook = new NoteBook("Work Notes");
const personalBook = new NoteBook("Personal");

workBook.addNote(
  "Task",
  "Review all the new users that registered this week",
  admin,
);

admin.addNotebook(workBook);
admin.addNotebook(personalBook);
admin.displayInfo();

admin.removeNotebook(personalBook);
admin.displayInfo(); // Notebooks: 1

personalBook.addNote("Idea", "Learn TypeScript generics", admin);
personalBook.displayNotes();

// 7.

class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
    console.log("Item added");
  }

  public removeItem(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index === -1) {
      console.log("Item not found");
      return false;
    }
    this.items.splice(index, 1);
    console.log("Item removed");
    return true;
  }

  public getAllItems(): T[] {
    return [...this.items];
  }
}


const numbers = new Storage<number>();
numbers.addItem(10);
numbers.addItem(20);
numbers.removeItem(10);
console.log(numbers.getAllItems()); 

const words = new Storage<string>();
words.addItem("TypeScript");
console.log(words.getAllItems()); 


const noteStorage = new Storage<Note>();
const n = new Note("Idea", "Learn generics", admin);
noteStorage.addItem(n);
console.log(noteStorage.getAllItems().length); 

