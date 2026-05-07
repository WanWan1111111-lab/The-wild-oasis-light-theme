import { HiTrash, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useCoupons } from "./useCoupons";
import { useDeleteCoupon, useToggleCoupon } from "./useDeleteCoupon";

const Badge = styled.span`
  padding: 0.2rem 0.8rem;
  border-radius: 10rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: ${({ active }) =>
    active ? "var(--color-green-100)" : "var(--color-grey-100)"};
  color: ${({ active }) =>
    active ? "var(--color-green-700)" : "var(--color-grey-500)"};
`;

const TypeBadge = styled.span`
  padding: 0.2rem 0.8rem;
  border-radius: 10rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
`;

function CouponTable() {
  const { coupons, isLoading } = useCoupons();
  const { removeCoupon, isDeleting } = useDeleteCoupon();
  const { toggleCoupon, isToggling } = useToggleCoupon();

  if (isLoading) return <Spinner />;
  if (!coupons?.length)
    return <p style={{ padding: "2.4rem", color: "var(--color-grey-500)" }}>暂无优惠券，点击上方按钮创建</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.4rem" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--color-grey-100)", textAlign: "left" }}>
          {["折扣码", "类型", "优惠值", "最低消费", "到期时间", "已用/上限", "新客礼包", "状态", "操作"].map((h) => (
            <th key={h} style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)", fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {coupons.map((c) => (
          <tr key={c.id} style={{ borderBottom: "1px solid var(--color-grey-100)" }}>
            <td style={{ padding: "1.2rem 1.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>{c.code}</td>
            <td style={{ padding: "1.2rem 1.6rem" }}>
              <TypeBadge>{c.type === "fixed" ? "固定减免" : "百分比"}</TypeBadge>
            </td>
            <td style={{ padding: "1.2rem 1.6rem", fontWeight: 600, color: "var(--color-brand-600)" }}>
              {c.type === "fixed" ? `¥${c.value}` : `${c.value}% off`}
            </td>
            <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)" }}>
              {c.min_spend > 0 ? `满¥${c.min_spend}` : "无门槛"}
            </td>
            <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-500)", whiteSpace: "nowrap" }}>
              {c.end_date
                ? format(new Date(c.end_date), "yyyy/MM/dd", { locale: zhCN })
                : <span style={{ color: "var(--color-grey-400)" }}>永久</span>}
            </td>
            <td style={{ padding: "1.2rem 1.6rem", color: "var(--color-grey-600)" }}>
              {c.used_count} / {c.max_uses ?? "∞"}
            </td>
            <td style={{ padding: "1.2rem 1.6rem" }}>
              {c.is_welcome_pack ? (
                <span style={{ padding: "0.2rem 0.8rem", borderRadius: "10rem", fontSize: "1.1rem", fontWeight: 600, backgroundColor: "var(--color-yellow-100)", color: "var(--color-yellow-700)" }}>🎁 礼包券</span>
              ) : (
                <span style={{ color: "var(--color-grey-400)", fontSize: "1.2rem" }}>—</span>
              )}
            </td>
            <td style={{ padding: "1.2rem 1.6rem" }}>
              <Badge active={c.is_active}>{c.is_active ? "启用" : "禁用"}</Badge>
            </td>
            <td style={{ padding: "1.2rem 1.6rem" }}>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                  title={c.is_active ? "禁用" : "启用"}
                  disabled={isToggling}
                  onClick={() => toggleCoupon({ id: c.id, is_active: !c.is_active })}
                  style={{
                    color: c.is_active ? "var(--color-yellow-700)" : "var(--color-green-700)",
                    cursor: "pointer", background: "none", border: "none", fontSize: "1.8rem",
                  }}
                >
                  {c.is_active ? <HiOutlineXCircle /> : <HiOutlineCheckCircle />}
                </button>
                <button
                  title="删除"
                  disabled={isDeleting}
                  onClick={() => removeCoupon(c.id)}
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
  );
}

export default CouponTable;
