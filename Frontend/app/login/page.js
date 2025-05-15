"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3006/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("userId", data.userId);

      router.push("/account");
    } else {
      alert("Inloggning misslyckades");
    }
  };

  return (
    <div className="bg-orange-200 min-h-screen border border-gray-50">
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
      <h1 className="text-2xl  flex  py-20 m-2  items-center text-blue-700 p-4 justify-center">
        Logga in{" "}
      </h1>
      <div className="flex flex-col gap-6 bg-green-500 p-10 max-w-md mx-auto rounded-lg shadow-md">
        <form
          onSubmit={handleLogin}
          className=" flex flex-col justify-center  "
        >
          <input
            className="bg-white border-2 m-1"
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="bg-white border-2 m-1"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className=" border-2 bg-gray-200" type="submit">
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
}
