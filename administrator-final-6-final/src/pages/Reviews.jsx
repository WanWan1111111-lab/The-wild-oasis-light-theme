import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ReviewTable from "../features/reviews/ReviewTable";

function Reviews() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">评价管理</Heading>
      </Row>
      <ReviewTable />
    </>
  );
}

export default Reviews;
