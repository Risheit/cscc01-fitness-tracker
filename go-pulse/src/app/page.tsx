import Link from "next/link";
import PostButton from "./components/PostButton";
import NavBar from "./components/NavBar";
import pool from "./db/database";
import dotenv from "dotenv";

dotenv.config();

export default function Home() {
  const addNote = async () => {
    "use server";

    try {
      await pool.query("INSERT INTO note (content) VALUES ('hello, world')");
    } catch (e) {
      console.log("addNote", e);
    }
  };

  return (
    <main className="p-20">
      <NavBar />      

      {/* Page Content */}
      <h1 className="text-2xl font-bold mt-6">Welcome to the Home Page</h1>

      <PostButton postAction={addNote} />
    </main>
  );
}
