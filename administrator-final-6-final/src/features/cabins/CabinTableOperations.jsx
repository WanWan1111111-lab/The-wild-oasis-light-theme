import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import Input from "../../ui/Input";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import styled from "styled-components";

const SearchInput = styled(Input)`
  width: 20rem;
`;

function CabinTableOperations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const debounceTimer = useRef(null);

  function handleSearch(e) {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const value = e.target.value.trim();
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      setSearchParams(params, { replace: true });
    }, 300);
  }

  return (
    <TableOperations>
      <SearchInput
        type="text"
        defaultValue={searchQuery}
        onChange={handleSearch}
        placeholder="搜索木屋名称..."
      />
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "全部" },
          { value: "no-discount", label: "无折扣" },
          { value: "with-discount", label: "有折扣" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "按名称排序 (A-Z)" },
          { value: "name-desc", label: "按名称排序 (Z-A)" },
          { value: "regularPrice-asc", label: "按价格排序 (低到高)" },
          { value: "regularPrice-desc", label: "按价格排序 (高到低)" },
          { value: "maxCapacity-asc", label: "按人数排序 (少到多)" },
          { value: "maxCapacity-desc", label: "按人数排序 (多到少)" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
