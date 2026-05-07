import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateReviewStatus, deleteReview } from "../../services/apiReviews";

export function useUpdateReview() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => updateReviewStatus(id, status),
    onSuccess: () => {
      toast.success("评价状态已更新");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: removeReview, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => deleteReview(id),
    onSuccess: () => {
      toast.success("评价已删除");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateStatus, isUpdating, removeReview, isDeleting };
}
