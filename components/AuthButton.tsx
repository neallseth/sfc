"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LogIn, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "./SignInModal";
import { Tables } from "@/lib/types/database.types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  History,
  PanelBottomClose,
  NotepadText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloseAuction } from "@/components/CloseAuction";

type Props = {
  user: Tables<"users"> | null;
  setUser: Dispatch<SetStateAction<Tables<"users"> | null>>;
};

export default function AuthButton({ user, setUser }: Props) {
  const signOut = async () => {};
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<Array<Tables<"users">>>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const supabase = createClient();
      const { data, error } = await supabase.from("users").select();
      if (data) {
        setUsers(data);
      } else if (error) {
        console.error(error);
      }
    }
    loadUsers();
  }, []);

  function handleSignIn(user: Tables<"users"> | null) {
    setUser(user);
    localStorage.setItem("recent-user", JSON.stringify(user));
  }

  return user ? (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex">
            <Button variant={"ghost"}>
              {" "}
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage
                  src={user.name === "Neall Seth" ? "./assets/yud.jpg" : ""}
                />
                <AvatarFallback>{user.name?.split(" ")[0][0]}</AvatarFallback>
              </Avatar>
              {user.name?.split(" ")[0]}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>My account</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <History className="mr-2 h-4 w-4" />
              <span>Order history</span>
              <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Server className="mr-2 h-4 w-4" />
            <span>Capacity info</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <Link href="/notes" target="_blank">
            <DropdownMenuItem>
              <NotepadText className="mr-2 h-4 w-4" />
              <span>Notes</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSub>
            <DialogTrigger asChild>
              <DropdownMenuItem
              // onSelect={(e) => {
              //   e.preventDefault();
              //   setDropdownOpen(false);
              // }}
              >
                <PanelBottomClose className="mr-2 h-4 w-4" />
                <span>Close auction</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Change user</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {users.map((user) => {
                  return (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleSignIn(user)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => {
              setUser(null);
              localStorage.removeItem("recent-user");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CloseAuction
        closeBidModal={() => {
          setDialogOpen(false);
        }}
      />
    </Dialog>
  ) : (
    <SignInModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      users={users}
      setUsers={setUsers}
      handleSignIn={handleSignIn}
    >
      <Button variant="secondary">
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    </SignInModal>
  );
}
