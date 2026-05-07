import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "全部" },
          { value: "checked-out", label: "结账了" },
          { value: "checked-in", label: "入住" },
          { value: "unconfirmed", label: "未确认" },
          { value: "refunded", label: "已退款" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "按日期排序 (最新)" },
          { value: "startDate-asc", label: "按日期排序 (最早)" },
          {
            value: "totalPrice-desc",
            label: "按金额排序 (高到低)",
          },
          { value: "totalPrice-asc", label: "按金额排序 (低到高)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
