import { json, redirect } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import NewNote, { links as newNoteLinks } from '~/components/NewNote'
import NoteList,  { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  )
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    // if a json error is thrown, the catch boundary will be triggered
    throw json({ message: 'Could not find and notes.'}, {
      status: 404,
      statusText: 'Not Found'
    });
  }
  return notes;
}

// will run on the server, will not be downloaded by client
export async function action({ request }) {
  const formData = await request.formData()
  const noteData = Object.fromEntries(formData);
  // add validatoins
  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid title - must be atleast 5 characters long' }
  }
  const existingNotes = await getStoredNotes();
  // await new Promise((res) => setTimeout(res, 2000))
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData)
  await storeNotes(updatedNotes);
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function CatchBoundary() {
  const caughtResponse = useCatch();
  const message = caughtResponse.data?.message || 'Data not found';
  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  )
}

// Here if something goes wrong under this component, the Outlet will
// replace the component with the Error boundary exported from the function
export function ErrorBoundary({error}) {
  return (
    <main className="error">
      <h1>An error occured</h1>
      <p>{error.message}</p>
      <p>Back to <Link>Safety</Link>!</p>
    </main>
  )
}

export function meta() {
  return {
    title: 'All notes',
    description: 'Manage your notes with ease'
  }
}