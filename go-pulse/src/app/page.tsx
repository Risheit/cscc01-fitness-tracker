import PostButton from './components/PostButton';
import pool from './db/database';
import dotenv from 'dotenv';

dotenv.config();

export default function Home() {
  // For more on server actions, see:
  // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
  // In essence, this just provides a simpler way to write a POST call from the client.
  const addNote = async () => {
    'use server';

    // Currently, we just insert a dummy string into our test database.
    // The updates can be seen by connecting to the db manually (see the README on how to do that).
    try {
      await pool.query("INSERT INTO note (content) VALUES ('hello, world')");
    } catch (e) {
      console.log('addNote', e);
    }
  }

  return (
    <main className="p-20">
      <PostButton postAction={addNote} />
    </main>
  );
}
