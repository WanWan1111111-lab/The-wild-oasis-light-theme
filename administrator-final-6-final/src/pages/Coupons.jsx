import { useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import CouponTable from "../features/coupons/CouponTable";
import CreateCouponForm from "../features/coupons/CreateCouponForm";

function Coupons() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">优惠券管理</Heading>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "收起" : "+ 创建优惠券"}
        </Button>
      </Row>

      {showForm && <CreateCouponForm onClose={() => setShowForm(false)} />}

      <CouponTable />
    </>
  );
}

export default Coupons;
