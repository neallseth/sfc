"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { Database, Tables, Enums } from "@/lib/types/database.types";

type Props = {
  children: React.ReactNode;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function SignInModal({ children, modalOpen, setModalOpen }: Props) {
  const [users, setUsers] = useState<Array<Tables<"users">>>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const supabase = createClient();
      const { data, error } = await supabase.from("users").select();
      if (data) {
        setUsers(data);
        console.log(data);
      }
    }
    loadUsers();
  }, []);

  function handleSignIn() {
    setModalOpen(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign-in</DialogTitle>
          <DialogDescription>
            Simulated sign-in flow; manage state of all users.
          </DialogDescription>
        </DialogHeader>
        {/* <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Existing User</TabsTrigger>
            <TabsTrigger value="password">New User</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs> */}
        <div className="flex py-4 justify-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedUser
                  ? users.find((user) => user.name === selectedUser)?.name
                  : "Select user..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandEmpty>User not found</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.name || ""}
                      onSelect={(currentValue) => {
                        setSelectedUser(
                          currentValue === selectedUser ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser === user.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="flex sm:justify-center">
          <Button
            onClick={handleSignIn}
            className="w-full"
            disabled={!selectedUser}
            type="submit"
          >
            Sign in{selectedUser ? ` as ${selectedUser}` : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
