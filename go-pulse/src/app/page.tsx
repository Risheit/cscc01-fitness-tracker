import NavBar from "./components/NavBar";

export default function Home() {
  return (
    <div>      
      <NavBar />
      <main className="p-20">
        {/* Page Content */}
        <h1 className="text-2xl font-bold mt-6">Welcome to the Home Page</h1>
      </main>
    </div>
  );
}
