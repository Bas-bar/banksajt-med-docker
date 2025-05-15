"use client";
import { useState, useEffect } from "react";

export default function Account() {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  // Hämta saldo
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId);
    if (!userId) return;
    fetch("http://localhost:3006/me/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }, []);

  // Sätt in pengar
  const handleDeposit = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      "http://localhost:3006/me/accounts/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount }),
      }
    );
    const data = await response.json();
    setBalance(data.newBalance);
    setAmount(0); // nollställ input
  };

  return (
    <div>
      <h1 className="bg-blue-300 flex items-center justify-center p-10  text-3xl">
        Ditt konto
      </h1>
      <p className=" flex justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600     ">
        Saldo: {balance} kr
      </p>
      <div className=" flex justify-center bg-blue-300 p-5">
        <input
          className="bg-white border-2 mx-3"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button
          className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={handleDeposit}
        >
          Sätt in pengar
        </button>
      </div>
    </div>
  );
}
