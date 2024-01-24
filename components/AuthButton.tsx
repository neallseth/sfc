"use client";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "./SignInModal";

type Props = {
  user: number | null;
  setUser: Dispatch<SetStateAction<number | null>>;
};

export default async function AuthButton({ user, setUser }: Props) {
  const signOut = async () => {};

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user}!
      <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </div>
  ) : (
    <SignInModal>
      <Button variant="secondary">
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    </SignInModal>
  );
}
