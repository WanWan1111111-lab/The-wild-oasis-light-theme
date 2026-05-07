import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "../../services/apiCoupons";

export function useCoupons() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });
  return { coupons, isLoading };
}
