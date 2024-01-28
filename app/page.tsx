"use client";

import AuthButton from "../components/AuthButton";
import ConnectSupabaseSteps from "@/components/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/SignUpUserSteps";
import { useEffect, useState } from "react";
import OrderStatus from "@/components/OrderStatus";
import { Tables } from "@/lib/types/database.types";
import OrdersView from "@/components/OrdersView";
import ExploreView from "@/components/ExploreView";
import ProcurementView from "@/components/procurement/ProcurementView";
import { createClient } from "@/utils/supabase/client";

export default function Index() {
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  const [userBids, setUserBids] = useState<Array<Tables<"bids">> | null>(null);

  useEffect(() => {
    const lastUsedUser = localStorage.getItem("recent-user");
    if (lastUsedUser) {
      setUser(JSON.parse(lastUsedUser));
    }
  }, []);

  useEffect(() => {
    async function pullUserOrders() {
      if (!user) {
        return;
      }

      const supabase = createClient();
      const { data: bids, error } = await supabase
        .from("bids")
        .select()
        .eq("user_id", user.id);

      if (!error) {
        setUserBids(bids);
        console.log(bids);
      }
    }

    pullUserOrders();
  }, [user]);

  return (
    <div className="grow w-full flex flex-col gap-6 md:gap-12 items-center">
      <nav className="w-full flex border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm">
          <p className="font-semibold">SFC Reservation Console</p>
          <AuthButton user={user} setUser={setUser} />
        </div>
      </nav>

      <main className="grow w-full px-6 md:px-12 flex flex-col gap-6 md:gap-12">
        <OrdersView user={user} />
        <ExploreView />
        <ProcurementView user={user} />
      </main>

      <footer className="w-full bg-neutral-50 border-t border-t-bg-neutral-200 p-6 flex justify-center text-center text-xs">
        <p>Made, of course, in San Francisco </p>
      </footer>
    </div>
  );
}
