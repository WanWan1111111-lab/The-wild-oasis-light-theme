import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCoupon } from "../../services/apiCoupons";
import toast from "react-hot-toast";

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("优惠券创建成功");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createCoupon: mutate, isCreating: isPending };
}
