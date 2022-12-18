import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";
import NoteDetailStyle from '~/styles/NoteDetail.css';

export default function NotesDetailsPage() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-detail-content">{note.content}</p>
    </main>
  )
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find(note => note.id === noteId);
  if (!selectedNote) {
    // if no catch boundary is defined, then it will take the immediate parent's catch boundary
    throw json(
      { message: 'Could not find a note for id: ' + noteId},
      { status: 404 }
    )
  }
  return selectedNote;
}

export function links() {
  return [{ rel: 'stylesheet', href: NoteDetailStyle }]
}

export function meta({ data }) {
  return {
    title: data.title,
    description: 'Manage your notes with ease'
  }
}