cat <<EOF > README.md
# 🔐 VaultNotes - Google Keep Clone

A secure, fullstack note-taking application built with **NestJS**, **TypeORM**, and **PostgreSQL/SQLite**. This project demonstrates a robust "One-to-Many" relationship where users can securely manage their own private vault of notes.

## 🚀 Key Features

* **User Authentication**: Secure registration and login with **bcrypt** password hashing.
* **Keep-Style UI**: A clean, responsive grid layout for notes using **Tailwind CSS**.
* **Full CRUD**: Create, Read, Update (via modal), and Delete notes.
* **Ownership Logic**: Notes are linked to a specific \`userId\`, ensuring users only see their own content.
* **Zod Validation**: Strict data validation using Zod schemas to prevent "Bad Requests."

## 🏗️ Architecture

The project follows the standard NestJS modular architecture:

* **Auth Module**: Handles `POST /auth/register` and `POST /auth/login`.
* **Users Module**: Manages user entities and relations.
* **Notes Module**: Manages note creation and fetching via user-specific params.
* **Pipes**: Custom `ZodValidationPipe` for sanitizing incoming request bodies.



## 🛠️ Tech Stack

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| Vanilla JS / HTML5 | NestJS (TS) | PostgreSQL |
| Tailwind CSS | TypeORM | bcrypt |

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Configuration**:
   Update your `dbConfig.ts` with your credentials. Ensure `synchronize: true` is enabled for the first run to generate tables.

3. **Run the App**:
   ```bash
   npm run start:dev
   ```

4. **Frontend**:
   Open `index.html` in your browser using a "Live Server" extension.

## 📝 Entity Relationship

The core of this app is the link between the **User** and the **Note**:
- **User**: `@OneToMany(() => Note, note => note.user)`
- **Note**: `@ManyToOne(() => User, user => user.notes)`
