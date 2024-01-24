"use client";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { LogIn, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "./SignInModal";
import { Tables } from "@/lib/types/database.types";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: Tables<"users"> | null;
  setUser: Dispatch<SetStateAction<Tables<"users"> | null>>;
};

export default function AuthButton({ user, setUser }: Props) {
  const signOut = async () => {};
  const [modalOpen, setModalOpen] = useState(false);

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Button variant={"ghost"}>
            {" "}
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src="./assets/yud.jpg" />
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
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            <span>Order history</span>
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Server className="mr-2 h-4 w-4" />
          <span>Capacity info</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setUser(null)}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <SignInModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      setSignedInUser={setUser}
    >
      <Button variant="secondary">
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    </SignInModal>
  );
}
