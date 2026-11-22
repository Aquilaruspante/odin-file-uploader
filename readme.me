# Odin File Uploader

A stripped-down personal cloud storage app, inspired by Google Drive. Built as the **File Uploader** project of [The Odin Project](https://www.theodinproject.com/lessons/nodejs-file-uploader) Node.js course.

**Live demo:** https://odin-file-uploader-kf48.onrender.com/users/login

## Features

- **Authentication** – sign up and log in with username and password (Passport.js local strategy, passwords hashed with bcrypt). Sessions are persisted in PostgreSQL through the Prisma session store.
- **Folders** – create, view and delete folders. Each user can only access their own folders.
- **File upload** – upload files into a folder with Multer. File name, size, type and upload date are stored in the database.
- **File preview** – files are displayed according to their MIME type:
  - images → `<img>`
  - videos → `<video>`
  - PDFs → `<iframe>`
  - everything else → "No preview available" and a download link
- **Download** – every file can be downloaded with its original name.
- **Share folder** _(extra credit)_ – generate a public link to a folder, valid for a chosen duration. Anyone with the link can view and download the folder's files without logging in until the link expires. Links use a UUID so they can't be guessed.
- **Cloud storage** – files are stored on Cloudinary in production. During development they can be stored on the local filesystem instead (see `STORAGE` below).
- **Validation** – forms are validated server-side with express-validator.

## Tech stack

- **Node.js** + **Express**
- **EJS** templates
- **PostgreSQL** (hosted on [Neon](https://neon.tech))
- **Prisma ORM**
- **Passport.js** + **express-session** + **@quixo3/prisma-session-store**
- **Multer** for file uploads
- **Cloudinary** for file storage
- Deployed on **Render**

## Getting started

### Prerequisites

- Node.js
- A PostgreSQL database (local or hosted)
- A Cloudinary account (only needed if `STORAGE=cloudinary`)

### Installation

```bash
git clone git@github.com:Aquilaruspante/odin-file-uploader.git
cd odin-file-uploader
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/file_uploader"
SESSION_SECRET="a-long-random-string"

# "local" stores files in ./uploads, "cloudinary" uploads them to Cloudinary
STORAGE="local"

# Only required when STORAGE="cloudinary"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="file-uploader-dev"
```

### Database setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Run

```bash
node app.js
```

The app runs at `http://localhost:3000`.

## Deployment (Render + Neon)

1. Create a PostgreSQL database on Neon and copy its **direct** (non-pooled) connection string.
2. Create a new Web Service on Render connected to this repository.
3. Set the environment variables listed above, plus:
   ```env
   NODE_ENV="production"
   STORAGE="cloudinary"
   ```
4. Build command:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
5. Start command:
   ```bash
   node app.js
   ```

## Notes

- On free Cloudinary accounts, delivery of PDF and ZIP files is blocked by default. Enable **"Allow delivery of PDF and ZIP files"** in the Cloudinary console under *Settings → Security*.
- Browsers can't preview office documents (`.docx`, `.ods`, `.odg`, …), so these files are download-only.
- Some `.mov` videos may not play in Chrome if they use a non-standard H.264 variant. With Cloudinary they can be delivered as `.mp4`.

## Acknowledgements

Project specification by [The Odin Project](https://www.theodinproject.com/).