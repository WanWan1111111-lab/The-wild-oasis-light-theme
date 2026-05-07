import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getReviews } from "../../services/apiReviews";

export function useReviews() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("reviewStatus") || "all";

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", status],
    queryFn: () => getReviews({ status }),
  });

  return { reviews, isLoading };
}
