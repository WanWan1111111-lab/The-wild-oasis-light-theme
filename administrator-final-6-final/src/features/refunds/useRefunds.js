import { useQuery } from "@tanstack/react-query";
import { getRefundRequests } from "../../services/apiRefunds";

export function useRefunds() {
  const { data: refunds, isLoading } = useQuery({
    queryKey: ["refunds"],
    queryFn: getRefundRequests,
  });

  return { refunds, isLoading };
}
