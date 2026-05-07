import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveRefund, rejectRefund } from "../../services/apiRefunds";
import { toast } from "react-hot-toast";

export function useReviewRefund() {
  const queryClient = useQueryClient();

  const { mutate: approve, isLoading: isApproving } = useMutation({
    mutationFn: ({ bookingId, note }) => approveRefund(bookingId, note),
    onSuccess: () => {
      toast.success("退款已通过，用户已收到通知");
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    },
    onError: () => toast.error("操作失败，请重试"),
  });

  const { mutate: reject, isLoading: isRejecting } = useMutation({
    mutationFn: ({ bookingId, note }) => rejectRefund(bookingId, note),
    onSuccess: () => {
      toast.success("已拒绝退款申请");
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    },
    onError: () => toast.error("操作失败，请重试"),
  });

  return { approve, reject, isApproving, isRejecting };
}
