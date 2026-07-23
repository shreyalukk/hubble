"use client";

import { useState } from "react";
import { ShoppingBag, Tag, Plus, Search, MessageSquare, DollarSign, X, Sparkles, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  sellerName: string;
  sellerId: string;
  date: string;
}

interface MarketplaceClientProps {
  initialItems: MarketplaceItem[];
  currentUserId: string;
}

export function MarketplaceClient({ initialItems, currentUserId }: MarketplaceClientProps) {
  const supabase = createClient();
  const [items, setItems] = useState<MarketplaceItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [isPosting, setIsPosting] = useState(false);

  const categories = ["Textbooks", "Lab Equipment", "Calculators", "Tech & Gadgets", "Dorm Essentials"];

  const handleListItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setIsPosting(true);

    try {
      const { data: userProfile } = await supabase
        .from("users")
        .select("college_id, full_name")
        .eq("id", currentUserId)
        .single();

      const { data: newItem, error } = await supabase
        .from("marketplace")
        .insert({
          title,
          description,
          price: parseFloat(price) || 0,
          category,
          college_id: userProfile?.college_id,
          seller_id: currentUserId,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to post listing: ${error.message}`);
        setIsPosting(false);
        return;
      }

      if (newItem) {
        const formatted: MarketplaceItem = {
          id: newItem.id,
          title: newItem.title,
          description: newItem.description || "",
          price: newItem.price || 0,
          category: newItem.category || "Textbooks",
          status: "available",
          sellerName: userProfile?.full_name || "You",
          sellerId: currentUserId,
          date: "Just now",
        };

        setItems((prev) => [formatted, ...prev]);
        setIsModalOpen(false);

        setTitle("");
        setDescription("");
        setPrice("");
      }
    } catch (err) {
      console.error("Error creating listing:", err);
    } finally {
      setIsPosting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Campus Marketplace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Buy & Sell On Campus
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Buy, sell, or exchange used textbooks, lab coats, calculators & tech with campus peers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2D2D2D] hover:bg-gray-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#F5C542]" />
          <span>List Item for Sale</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E8DDD0]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search textbooks, calculators..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm outline-none bg-gray-50 border border-transparent focus:border-[#F5C542] text-[#1a1a1a] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#2D2D2D] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#2D2D2D] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-[#E8DDD0] hover:border-[#F5C542] transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {item.category}
                </span>
                <span className="text-sm font-extrabold text-emerald-700">
                  ₹{item.price}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1a1a1a] mb-1.5 leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Seller: {item.sellerName}</span>
              <Link
                href="/messages"
                className="px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#E8DDD0] text-gray-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DDD0]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">No marketplace items listed</h3>
          <p className="text-xs text-gray-400">List your used textbooks or equipment for campus buyers!</p>
        </div>
      )}

      {/* List Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E8DDD0] shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">List Item for Sale</h3>
                <p className="text-xs text-gray-500">Sell to students & faculty in your college</p>
              </div>
            </div>

            <form onSubmit={handleListItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Item Title <span className="text-[#F5C542]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal"
                  required
                  className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Price (₹) <span className="text-[#F5C542]">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250"
                    required
                    className="w-full h-10 px-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Category <span className="text-[#F5C542]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl text-xs outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Description & Condition
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention edition, condition (e.g. Almost new, no highlights), and preferred pickup spot..."
                  rows={3}
                  className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-[#E8DDD0] focus:border-[#F5C542] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting || !title || !price}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isPosting ? "Posting..." : "Post Listing"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
