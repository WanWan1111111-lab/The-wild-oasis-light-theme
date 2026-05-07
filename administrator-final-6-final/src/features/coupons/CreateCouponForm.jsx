import { useState } from "react";
import styled from "styled-components";
import { useCreateCoupon } from "./useCreateCoupon";

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem 2.4rem;
  padding: 2.4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  margin-bottom: 2.4rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
  display: block;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-900);
  font-size: 1.4rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  color: var(--color-grey-900);
  font-size: 1.4rem;
`;

const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background-color: ${({ variant }) =>
    variant === "secondary" ? "var(--color-grey-200)" : "var(--color-brand-600)"};
  color: ${({ variant }) =>
    variant === "secondary" ? "var(--color-grey-800)" : "var(--color-brand-50)"};
  &:hover {
    background-color: ${({ variant }) =>
      variant === "secondary" ? "var(--color-grey-300)" : "var(--color-brand-700)"};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const initialForm = {
  code: "",
  type: "fixed",
  value: "",
  min_spend: "0",
  end_date: "",
  max_uses: "",
  is_welcome_pack: false,
};

function CreateCouponForm({ onClose }) {
  const [form, setForm] = useState(initialForm);
  const { createCoupon, isCreating } = useCreateCoupon();

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.code || !form.value) return;
    createCoupon(
      {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        min_spend: Number(form.min_spend) || 0,
        end_date: form.end_date || null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        is_active: true,
        used_count: 0,
        is_welcome_pack: form.is_welcome_pack,
      },
      { onSuccess: () => { setForm(initialForm); onClose?.(); } }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label>折扣码 *</Label>
        <Input name="code" value={form.code} onChange={handleChange} placeholder="如 SUMMER2026" required />
      </div>
      <div>
        <Label>类型 *</Label>
        <Select name="type" value={form.type} onChange={handleChange}>
          <option value="fixed">固定减免（¥）</option>
          <option value="percent">百分比折扣（%）</option>
        </Select>
      </div>
      <div>
        <Label>优惠值 * {form.type === "fixed" ? "（减免金额 ¥）" : "（折扣百分比，如 10 = 减10%）"}</Label>
        <Input name="value" type="number" min="1" value={form.value} onChange={handleChange} placeholder={form.type === "fixed" ? "100" : "10"} required />
      </div>
      <div>
        <Label>最低消费门槛（¥）</Label>
        <Input name="min_spend" type="number" min="0" value={form.min_spend} onChange={handleChange} placeholder="0" />
      </div>
      <div>
        <Label>到期时间（留空=永久有效）</Label>
        <Input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange} />
      </div>
      <div>
        <Label>最大使用次数（留空=不限）</Label>
        <Input name="max_uses" type="number" min="1" value={form.max_uses} onChange={handleChange} placeholder="不限" />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.8rem", cursor: "pointer", fontSize: "1.3rem", fontWeight: 600, color: "var(--color-grey-600)" }}>
          <input
            type="checkbox"
            name="is_welcome_pack"
            checked={form.is_welcome_pack}
            onChange={handleChange}
            style={{ width: "1.6rem", height: "1.6rem", cursor: "pointer" }}
          />
          <span>设为新客礼包券</span>
        </label>
      </div>
      <ButtonRow>
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>取消</Button>
        )}
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "创建中..." : "创建优惠券"}
        </Button>
      </ButtonRow>
    </Form>
  );
}

export default CreateCouponForm;
