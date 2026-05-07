import { HiCheck, HiXMark, HiTrash } from "react-icons/hi2";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import Spinner from "../../ui/Spinner";
import { useReviews } from "./useReviews";
import { useUpdateReview } from "./useUpdateReview";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import styled from "styled-components";

const StatusBadge = styled.span`
  padding: 0.2rem 0.8rem;
  border-radius: 10rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: ${({ status }) =>
    status === "approved"
      ? "var(--color-green-100)"
      : status === "rejected"
      ? "var(--color-red-100)"
      : "var(--color-yellow-100)"};
  color: ${({ status }) =>
    status === "approved"
      ? "var(--color-green-700)"
      : status === "rejected"
      ? "var(--color-red-700)"
      : "var(--color-yellow-700)"};
`;

const statusLabel = { pending: "待审核", approved: "已通过", rejected: "已拒绝" };

function Stars({ rating }) {
  return (
    <span style={{ color: "var(--color-yellow-700)", fontSize: "1.4rem" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function ReviewTable() {
  const { reviews, isLoading } = useReviews();
  const { updateStatus, isUpdating, removeReview, isDeleting } = useUpdateReview();

  return (
    <div>
      <TableOperations style={{ marginBottom: "2.4rem" }}>
        <Filter
          filterField="reviewStatus"
          options={[
            { value: "all", label: "全部" },
            { value: "pending", label: "待审核" },
            { value: "approved", label: "已通过" },
            { value: "rejected", label: "已拒绝" },
          ]}
        />
      </TableOperations>

      {isLoading ? (
        <Spinner />
      ) : !reviews?.length ? (
        <p style={{ padding: "2.4rem", color: "var(--color-grey-500)" }}>暂无评价</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.4rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-grey-100)", textAlign: "left" }}>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>木屋</th>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>用户</th>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>评分</th>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>评论</th>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>时间</th>
              <th style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>状态</th>
              <th style={{ padding: "1.2rem 1.6rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} style={{ borderBottom: "1px solid var(--color-grey-100)" }}>
                <td style={{ padding: "1.2rem 1.6rem", fontWeight: 600 }}>
                  {review.cabins?.name}号
                </td>
                <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)" }}>
                  <div>{review.guests?.fullName}</div>
                  <div style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}>
                    {review.guests?.email}
                  </div>
                </td>
                <td style={{ padding: "1.2rem 1.6rem" }}>
                  <Stars rating={review.rating} />
                </td>
                <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", maxWidth: "24rem" }}>
                  {review.comment || <span style={{ color: "var(--color-grey-400)" }}>—</span>}
                </td>
                <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-500)", whiteSpace: "nowrap" }}>
                  {format(new Date(review.created_at), "yyyy/MM/dd", { locale: zhCN })}
                </td>
                <td style={{ padding: "1.2rem 1.6rem" }}>
                  <StatusBadge status={review.status}>{statusLabel[review.status]}</StatusBadge>
                </td>
                <td style={{ padding: "1.2rem 1.6rem" }}>
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    {review.status !== "approved" && (
                      <button
                        title="通过"
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: review.id, status: "approved" })}
                        style={{ color: "var(--color-green-700)", cursor: "pointer", background: "none", border: "none", fontSize: "1.8rem" }}
                      >
                        <HiCheck />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        title="拒绝"
                        disabled={isUpdating}
                        onClick={() => updateStatus({ id: review.id, status: "rejected" })}
                        style={{ color: "var(--color-yellow-700)", cursor: "pointer", background: "none", border: "none", fontSize: "1.8rem" }}
                      >
                        <HiXMark />
                      </button>
                    )}
                    <button
                      title="删除"
                      disabled={isDeleting}
                      onClick={() => removeReview(review.id)}
                      style={{ color: "var(--color-red-700)", cursor: "pointer", background: "none", border: "none", fontSize: "1.8rem" }}
                    >
                      <HiTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReviewTable;
