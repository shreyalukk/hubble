import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MarketplaceClient } from "./marketplace-client";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: itemsData } = await supabase
    .from("marketplace")
    .select(`
      id,
      title,
      description,
      price,
      category,
      status,
      created_at,
      seller_id,
      users(full_name)
    `)
    .order("created_at", { ascending: false });

  const formattedItems = (itemsData || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description || "",
    price: item.price || 0,
    category: item.category || "Textbooks",
    status: item.status || "available",
    sellerName: item.users?.full_name || "Campus Student",
    sellerId: item.seller_id,
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <MarketplaceClient
      initialItems={formattedItems}
      currentUserId={user.id}
    />
  );
}
