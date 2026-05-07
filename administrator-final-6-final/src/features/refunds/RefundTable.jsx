import { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useRefunds } from "./useRefunds";
import { useReviewRefund } from "./useReviewRefund";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";

const Amount = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Discount = styled.span`
  font-size: 1.2rem;
  color: var(--color-green-700);
  background: var(--color-green-100);
  padding: 0.1rem 0.6rem;
  border-radius: 10rem;
  display: inline-block;
  margin-top: 0.2rem;
`;

const StatusBadge = styled.span`
  padding: 0.2rem 0.8rem;
  border-radius: 10rem;
  font-size: 1.2rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === "refunded" ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${({ $status }) =>
    $status === "refunded" ? "var(--color-green-700)" : "var(--color-yellow-700)"};
`;

const Reason = styled.p`
  color: var(--color-grey-500);
  font-size: 1.3rem;
  max-width: 16rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SectionTitle = styled.div`
  padding: 0.8rem 2.4rem;
  background: var(--color-grey-50);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-grey-200);
`;

const NoteInput = styled.textarea`
  width: 100%;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  resize: none;
  margin-bottom: 1.2rem;
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
  }
`;

function ReviewActions({ bookingId, onApprove, onReject, isApproving, isRejecting }) {
  const [note, setNote] = useState("");
  return (
    <div>
      <NoteInput
        rows={2}
        placeholder="备注（选填，将发送给用户）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div style={{ display: "flex", gap: "0.8rem" }}>
        <button
          onClick={() => onApprove({ bookingId, note })}
          disabled={isApproving}
          style={{
            background: "var(--color-brand-600)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--border-radius-sm)",
            padding: "0.6rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.3rem",
          }}
        >
          {isApproving ? "处理中..." : "通过"}
        </button>
        <button
          onClick={() => onReject({ bookingId, note })}
          disabled={isRejecting}
          style={{
            background: "var(--color-red-700)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--border-radius-sm)",
            padding: "0.6rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.3rem",
          }}
        >
          {isRejecting ? "处理中..." : "拒绝"}
        </button>
      </div>
    </div>
  );
}

function RefundRow({ booking, onApprove, onReject, isApproving, isRejecting }) {
  const isPending = booking.status === "refund_pending";
  // 优惠券折扣 = 原价 - 实付（cabinPrice 是原价，totalPrice 是实付）
  const discountAmount =
    booking.cabinPrice && booking.totalPrice
      ? booking.cabinPrice - booking.totalPrice
      : 0;

  return (
    <Table.Row>
      <div>#{booking.id}</div>
      <div>{booking.guests?.fullName ?? "—"}</div>
      <div>{booking.cabins?.name ?? "—"}号</div>
      <div>
        {format(new Date(booking.startDate), "M月d日", { locale: zhCN })}
      </div>
      <div>
        <div>
          <Amount>¥{booking.totalPrice}</Amount>
          <span style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}> 实付</span>
        </div>
        {discountAmount > 0 && (
          <Discount>券减 ¥{discountAmount}</Discount>
        )}
      </div>
      <div>
        <Reason title={booking.refund_reason}>
          {booking.refund_reason || "未填写"}
        </Reason>
      </div>
      <div>
        <StatusBadge $status={booking.status}>
          {isPending ? "审核中" : "已退款"}
        </StatusBadge>
        {!isPending && booking.refund_note && (
          <p style={{ fontSize: "1.2rem", color: "var(--color-grey-400)", marginTop: "0.4rem" }}>
            备注：{booking.refund_note}
          </p>
        )}
        {!isPending && booking.refund_reviewed_at && (
          <p style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}>
            {format(new Date(booking.refund_reviewed_at), "M月d日 HH:mm", { locale: zhCN })}
          </p>
        )}
      </div>
      <div>
        {isPending ? (
          <ReviewActions
            bookingId={booking.id}
            onApprove={onApprove}
            onReject={onReject}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        ) : (
          <span style={{ fontSize: "1.3rem", color: "var(--color-grey-400)" }}>—</span>
        )}
      </div>
    </Table.Row>
  );
}

function RefundTable() {
  const { refunds, isLoading } = useRefunds();
  const { approve, reject, isApproving, isRejecting } = useReviewRefund();

  if (isLoading) return <Spinner />;

  if (!refunds?.length)
    return (
      <p style={{ color: "var(--color-grey-500)", fontSize: "1.6rem", padding: "2.4rem 0" }}>
        暂无退款申请记录
      </p>
    );

  const pending = refunds.filter((b) => b.status === "refund_pending");
  const refunded = refunds.filter((b) => b.status === "refunded");

  const columns = "0.5fr 1.4fr 1fr 0.8fr 1.2fr 1.4fr 1fr 2fr";

  return (
    <div>
      {/* 待审核 */}
      {pending.length > 0 && (
        <>
          <SectionTitle>待审核 · {pending.length}</SectionTitle>
          <Table columns={columns}>
            <Table.Header>
              <div>订单号</div>
              <div>用户</div>
              <div>木屋</div>
              <div>入住日期</div>
              <div>退款金额</div>
              <div>退款原因</div>
              <div>状态</div>
              <div>操作</div>
            </Table.Header>
            <Table.Body
              data={pending}
              render={(booking) => (
                <RefundRow
                  key={booking.id}
                  booking={booking}
                  onApprove={approve}
                  onReject={reject}
                  isApproving={isApproving}
                  isRejecting={isRejecting}
                />
              )}
            />
          </Table>
        </>
      )}

      {/* 已处理 */}
      {refunded.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: pending.length > 0 ? "2.4rem" : 0 }}>
            已退款 · {refunded.length}
          </SectionTitle>
          <Table columns={columns}>
            <Table.Header>
              <div>订单号</div>
              <div>用户</div>
              <div>木屋</div>
              <div>入住日期</div>
              <div>退款金额</div>
              <div>退款原因</div>
              <div>状态</div>
              <div>审核备注 / 时间</div>
            </Table.Header>
            <Table.Body
              data={refunded}
              render={(booking) => (
                <RefundRow
                  key={booking.id}
                  booking={booking}
                  onApprove={approve}
                  onReject={reject}
                  isApproving={isApproving}
                  isRejecting={isRejecting}
                />
              )}
            />
          </Table>
        </>
      )}
    </div>
  );
}

export default RefundTable;
