import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import ProcurementForm from "@/components/procurement/ProcurementForm";
import { Tables } from "@/lib/types/database.types";

type Props = {
  user: Tables<"users"> | null;
};

export default function ProcurementView({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Compute</CardTitle>
        <CardDescription>Place a bid for the GPUs you need</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProcurementForm user={user} />
      </CardContent>
      {/* <CardFooter>
        <Button>Save changes</Button>
      </CardFooter> */}
    </Card>
  );

  // return (
  //   <Tabs defaultValue="account" className="">
  //     <TabsList className="grid w-full grid-cols-2">
  //       <TabsTrigger value="account">Order</TabsTrigger>
  //       <TabsTrigger value="password">Password</TabsTrigger>
  //     </TabsList>
  //     <TabsContent value="account">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Account</CardTitle>
  //           <CardDescription>
  //             Make changes to your account here. Click save when you're done.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-2">
  //           <div className="space-y-1">
  //             <Label htmlFor="name">Name</Label>
  //             <Input id="name" defaultValue="Pedro Duarte" />
  //           </div>
  //           <div className="space-y-1">
  //             <Label htmlFor="username">Username</Label>
  //             <Input id="username" defaultValue="@peduarte" />
  //           </div>
  //         </CardContent>
  //         <CardFooter>
  //           <Button>Save changes</Button>
  //         </CardFooter>
  //       </Card>
  //     </TabsContent>
  //     <TabsContent value="password">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Password</CardTitle>
  //           <CardDescription>
  //             Change your password here. After saving, you'll be logged out.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-2">
  //           <div className="space-y-1">
  //             <Label htmlFor="current">Current password</Label>
  //             <Input id="current" type="password" />
  //           </div>
  //           <div className="space-y-1">
  //             <Label htmlFor="new">New password</Label>
  //             <Input id="new" type="password" />
  //           </div>
  //         </CardContent>
  //         <CardFooter>
  //           <Button>Save password</Button>
  //         </CardFooter>
  //       </Card>
  //     </TabsContent>
  //   </Tabs>
  // );
}
