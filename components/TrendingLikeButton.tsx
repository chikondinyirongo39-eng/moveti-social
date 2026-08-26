"use client";

import { createClient } from "@/lib/supabase";
import { useState } from "react";

export default function TrendingLikeButton({
  releaseId,
  initialCount,
}: {
  releaseId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading || liked) return;

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.rpc("increment_like_count", {
      release_id: releaseId,
    });

    if (!error) {
      setCount((value) => value + 1);
      setLiked(true);
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading || liked}
      style={{
        border: "none",
        background: "transparent",
        cursor: liked ? "default" : "pointer",
        fontSize: "16px",
        padding: 0,
      }}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
