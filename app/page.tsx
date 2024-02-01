"use client";

import AuthButton from "../components/AuthButton";
import { useEffect, useState } from "react";
import OrderStatus from "@/components/orders/OrderCard";
import { Tables } from "@/lib/types/database.types";
import OrdersView from "@/components/orders/OrdersView";
import ExploreView from "@/components/explore/ExploreView";
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
    }

    let { data: capacity, error: capcityError } = await supabase.rpc(
      "capacity_day"
    );
    if (capcityError) console.error(error);
    else console.log(capacity);
  }

  useEffect(() => {
    pullUserOrders();
  }, [user]);

  return (
    <div className="grow w-full flex flex-col gap-6 md:gap-12 items-center">
      <nav className="w-full flex  bg-neutral-50 border-b-bg-neutral-200 border-b h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm">
          <p className="font-semibold">SFC Reservation Console</p>
          <AuthButton user={user} setUser={setUser} />
        </div>
      </nav>

      <main className="grow w-full max-w-screen-lg px-6 md:px-12 flex flex-col gap-6 md:gap-12">
        <OrdersView
          user={user}
          userBids={userBids}
          pullUserOrders={pullUserOrders}
        />
        <ExploreView />
        <ProcurementView user={user} pullUserOrders={pullUserOrders} />
      </main>

      <footer className="w-full bg-neutral-50 border-t border-t-bg-neutral-200 p-6 flex justify-center text-center text-xs">
        <p>Made, of course, in San Francisco &#10084;&#65039;</p>
      </footer>
    </div>
  );
}
