import Heading from "../ui/Heading";
import Row from "../ui/Row";
import RefundTable from "../features/refunds/RefundTable";

function Refunds() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">退款管理</Heading>
      </Row>
      <RefundTable />
    </>
  );
}

export default Refunds;
