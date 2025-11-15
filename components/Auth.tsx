import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

const Auth: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err) {
      setError("Auth failed: " + (err as Error).message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mb-2"
      />
      <button onClick={handleAuth} className="bg-blue-500 text-white p-2">
        {isSignUp ? "Sign Up" : "Login"}
      </button>
      <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2">
        Switch to {isSignUp ? "Login" : "Sign Up"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Auth;
