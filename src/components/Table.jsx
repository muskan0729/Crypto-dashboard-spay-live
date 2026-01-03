import { useState, useMemo, useEffect } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomSelect } from "./CustomSelect";
import * as XLSX from "xlsx";

const Table = ({
  columns,
  data,
  showSearch = true,
  showPagination = true,
  showStatusFilter = true,
  showDeleteColumn = true,
  showDateFilter = true,
  showSelectUserFilter = false,
  endPoint = "",
  refreshTable,
  setData,
  statusList,
  requiredExport = false,
}) => {
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  /* ---------------- Merchant Select ---------------- */
  useEffect(() => {
    const dataForSelect = Array.from(
      new Map(
        data?.map((item) => [
          item.user_id,
          { value: item.user_id, label: item.merchant_details },
        ])
      ).values()
    );
    setSelectData(dataForSelect);
  }, [data]);

  /* ---------------- Reset Page ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, startDate, endDate, selectedMerchant]);

  /* ---------------- Delete ---------------- */
  const handleConfirmModal = (id) => {
    setRecordId(id);
    setShowConfirmModal(true);
  };

  const modifiedEndpoint =
    endPoint && recordId ? `${endPoint}/${recordId}` : null;

  const { execute: deleteRecord } = usePost(modifiedEndpoint || "");

  const handleDelete = async (e) => {
    e?.preventDefault();
    if (!recordId || !modifiedEndpoint) return;

    try {
      const res = await deleteRecord({});
      if (res) {
        toast.success("Record deleted successfully!");
        setData?.((prev) => prev.filter((row) => row.id !== recordId));
        refreshTable?.();
        setShowConfirmModal(false);
        setRecordId(null);
      }
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  /* ---------------- Filtering ---------------- */
  const filteredData = useMemo(() => {
    return data?.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

      const matchesStatus =
        statusFilter === "all" ||
        String(row.status).toLowerCase() === statusFilter.toLowerCase();

      const rowDate = row.date ? new Date(row.date.split("-")[0]) : null;

      const matchesDate =
        (!startDate || (rowDate && rowDate >= startDate)) &&
        (!endDate || (rowDate && rowDate <= endDate));

      const matchesMerchant =
        !selectedMerchant || row.user_id === selectedMerchant.value;

      return matchesSearch && matchesStatus && matchesDate && matchesMerchant;
    });
  }, [search, statusFilter, startDate, endDate, selectedMerchant, data]);

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const exportToXL = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  return (
    <div className="w-full space-y-6 text-white">
      {/* ---------------- Filters ---------------- */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4 flex flex-wrap gap-3 items-end">
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[44px] w-full sm:w-64 px-4 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:ring-1 focus:ring-[#ffd700]"
          />
        )}

        {showSelectUserFilter && (
          <div className="h-[44px] w-full sm:w-64">
            <CustomSelect
              options={selectData}
              placeholder="Select Merchant"
              value={selectedMerchant}
              onChange={setSelectedMerchant}
            />
          </div>
        )}

        {showDateFilter && (
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="Start Date"
              className="h-[44px] px-4 rounded-xl bg-black/40 border border-white/10 text-sm"
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="End Date"
              className="h-[44px] px-4 rounded-xl bg-black/40 border border-white/10 text-sm"
            />
          </div>
        )}

        {showStatusFilter && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[44px] px-4 rounded-xl bg-black/40 border border-white/10 text-sm"
          >
            <option value="all">All Status</option>
            {statusList?.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}

        {requiredExport && (
          <button
            onClick={exportToXL}
            className="h-[44px] px-6 rounded-xl bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700] font-semibold hover:bg-[#ffd700]/40 transition"
          >
            Export
          </button>
        )}
      </div>

      {/* ---------------- Mobile Cards ---------------- */}
      <div className="lg:hidden space-y-4">
        {paginatedData?.length ? (
          paginatedData.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2 shadow-lg"
            >
              {columns.map((col, i) => (
                <div key={i} className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-400">{col.header}</span>
                  <span className="text-slate-200 text-right">
                    {col.Cell
                      ? col.Cell({ value: row[col.accessor], row })
                      : row[col.accessor]}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500">
            No records found
          </div>
        )}
      </div>

      {/* ---------------- Desktop Table ---------------- */}
      <div className="hidden z-[-10] lg:block w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <table className="w-full min-w-max whitespace-nowrap table-auto">
          <thead className="bg-black/80 ">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-2 py-1 text-xs font-semibold text-[#ffd700] text-left"
                >
                  {col.header}
                </th>
              ))}
              {showDeleteColumn && (
                <th className="px-2 py-2 text-xs font-semibold text-[#ffd700] text-left">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData?.map((row, i) => (
              <tr
                key={row.id}
                className={`transition ${i % 2 === 0 ? "bg-white/5" : "bg-white/10"
                  } hover:bg-white/20`}
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-2 py-3 text-xs">
                    {col.Cell
                      ? col.Cell({ value: row[col.accessor], row })
                      : row[col.accessor]}
                  </td>
                ))}
                {showDeleteColumn && (
                  <td className="px-2 py-3">
                    <button
                      onClick={() => handleConfirmModal(row.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="bg-black/40 border border-white/10 px-3 py-2 rounded-xl"
          >
            {[10, 50, 100].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  p < Math.ceil(filteredData.length / entriesPerPage)
                    ? p + 1
                    : p
                )
              }
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        showConfirmModal={showConfirmModal}
        handleConfirmModal={() => setShowConfirmModal(false)}
        action={handleDelete}
        heading="Confirm Delete"
        body="Are you sure you want to delete this record?"
      />
    </div>
  );
};

export default Table;
