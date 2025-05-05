import { User } from "@supabase/supabase-js";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

