'use client';

import ProtectedRoute from "./components/ProtectedRoute";
import React, {useState, useEffect} from "react";

import { useAuth } from "./context/AuthContext";

interface Note {
  id: string;
  body: string;
  user: number;
}

export default function Home() {
  const { authTokens, logoutUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/notes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens?.access}`,
      }
    })

    const data = await response.json()
    if (response.status === 200) {
      setNotes(data)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
  }

  useEffect(() => {
    getNotes();
  }, [])
  

  return (
    <>
      <div className="text-center mt-5">
        <h1 className="text-xl">Hi, Ravi</h1>
        <h3 className="text-green-600">You are logged in!</h3>
      </div>

      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ul>
    </>
  );
}
