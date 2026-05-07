import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCoupon, toggleCouponActive } from "../../services/apiCoupons";
import toast from "react-hot-toast";

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      toast.success("优惠券已删除");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { removeCoupon: mutate, isDeleting: isPending };
}

export function useToggleCoupon() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, is_active }) => toggleCouponActive(id, is_active),
    onSuccess: () => {
      toast.success("状态已更新");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { toggleCoupon: mutate, isToggling: isPending };
}
