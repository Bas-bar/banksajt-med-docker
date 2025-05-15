"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3006/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Något gick fel vid skapande av användare");
      }

      const data = await response.json();
      alert(`Användare skapad med ID: ${data.id}`);
      router.push("/login");
    } catch (error) {
      alert(`Fel: ${error.message}`);
    }
  };

  return (
    <div className="bg-orange-200 min-h-screen bor border-gray-50">
      <nav className="bg-amber-500 p-8 shadow-md border-2 border-gray-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold text-blue-900 border-2 rounded-2xl px-4 bg-white">
            Bank
          </div>
          <div className="space-x-6">
            <a
              href="/"
              className="  transition border-2 p-2 rounded-2xl m-2 bg-green-500 px-6 border-gray-300 text-white"
            >
              Hem
            </a>
            <a
              href="/login"
              className="   transition border-2 p-2 rounded-2xl m-2 bg-green-500 px-6 border-gray-300 text-white"
            >
              Logga in
            </a>
            <a
              href="/create-user"
              className="    transition border-2 p-2 rounded-2xl m-2 bg-green-500 px-6 border-gray-300 text-white"
            >
              Skapa användare
            </a>
          </div>
        </div>
      </nav>
      <h1 className="flex justify-center m-20 text-4xl text-blue-900">
        Välkommen till banken
      </h1>
      <form
        onSubmit={handleCreateUser}
        className="flex flex-col gap-4 bg-amber-500 p-10 max-w-md mx-auto rounded-lg shadow-md"
      >
        <input
          className="border-2 border-gray-300 p-2 rounded-md bg-white"
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border-2 border-gray-300 p-2 rounded-md bg-white"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="border-2 p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          Skapa användare
        </button>
      </form>
    </div>
  );
}
