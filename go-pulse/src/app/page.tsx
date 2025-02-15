import NavBar from "./components/NavBar";
import LogoutButton from "./components/LogoutButton";

export default function Home() {
  return (
    <div>      
      <NavBar />
      <LogoutButton />
      <main className="p-20">
        {/* Page Content */}
        <h1 className="text-2xl font-bold mt-6">Welcome to the Home Page</h1>
      </main>
    </div>
  );
}
