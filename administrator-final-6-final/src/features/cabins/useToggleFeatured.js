import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import supabase from "../../services/supabase";

async function updateFeatured({ id, is_featured }) {
  const { error } = await supabase
    .from("cabins")
    .update({ is_featured })
    .eq("id", id);

  if (error) throw new Error("推荐状态更新失败");
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  const { mutate: toggle, isLoading } = useMutation({
    mutationFn: updateFeatured,
    onSuccess: () => {
      toast.success("推荐状态已更新");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { toggle, isLoading };
}
