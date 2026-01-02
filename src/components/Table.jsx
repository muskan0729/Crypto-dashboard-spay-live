import { useState, useMemo, useEffect } from "react";
import Button from "./Button";
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
  requiredExport=false
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

  /* ---------------------------------- */
  /* Merchant Select Data               */
  /* ---------------------------------- */
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

  /* ---------------------------------- */
  /* Reset Page on Filter Change        */
  /* ---------------------------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, startDate, endDate, selectedMerchant]);

  /* ---------------------------------- */
  /* Delete Logic                       */
  /* ---------------------------------- */
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
        if (setData) {
          setData((prev) => prev.filter((row) => row.id !== recordId));
        }
        refreshTable?.();
        setShowConfirmModal(false);
        setRecordId(null);
      }
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  /* ---------------------------------- */
  /* Filtering                          */
  /* ---------------------------------- */
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
    // paginatedData.append
    // console.log(paginatedData);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 text-white p-4">
      {/* ---------------- Filters ---------------- */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        {/* Search */}
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        h-[44px]
        w-full sm:w-64 xl:w-72
        px-4
        rounded-2xl
        
        border
        text-sm
        text-white
        placeholder-slate-400
        shadow-xl
        outline-none
        transition
        focus:ring-1 focus:ring-[#ffd700]
      "
          />
        )}

        {/* Merchant Select */}
        {showSelectUserFilter && (
          <div className="h-[44px] w-full sm:w-64 xl:w-72">
            <CustomSelect
              options={selectData}
              placeholder="Select Merchant"
              value={selectedMerchant}
              onChange={setSelectedMerchant}
            />
          </div>
        )}

        {/* Date Range */}
        {showDateFilter && (
          <div className="flex items-center gap-2 h-[44px]">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="
          h-[44px]
          px-4
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          text-sm
          text-white
          shadow-xl
          outline-none
          focus:ring-1 focus:ring-[#ffd700]
        "
            />
            <span className="text-slate-400 text-sm">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="
          h-[44px]
          px-4
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          text-sm
          text-white
          shadow-xl
          outline-none
          focus:ring-1 focus:ring-[#ffd700]
        "
            />
          </div>
        )}

        {/* Status Filter */}
        {showStatusFilter && (
          <div className="relative h-[44px] w-full sm:w-48">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ffd700]/20 via-orange-500/10 to-red-500/10 blur-2xl rounded-2xl" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
          h-[44px]
          w-full
          px-4
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          shadow-xl
          text-sm
          text-white
          outline-none
          cursor-pointer
          transition
          hover:bg-white/10
          focus:ring-1 focus:ring-[#ffd700]
        "
            >
              <option value="all" className="bg-black text-white">
                All Status
              </option>
              {statusList?.map((item, i) => (
                <option key={i} value={item} className="bg-black text-white">
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Export Button */}
       {requiredExport &&  <button
          onClick={exportToXL}
          className="
      h-[44px]
      px-6
      rounded-2xl
      bg-gradient-to-r from-[#ffd700] via-orange-500 to-red-500
      text-black
      text-sm
      font-semibold
      shadow-xl
      transition
      hover:opacity-90
      active:scale-[0.98]
      whitespace-nowrap
    "
        >
          Export
        </button>}
      </div>

      {/* ---------------- Mobile Cards ---------------- */}
      <div className="block lg:hidden space-y-4">
        {paginatedData?.length ? (
          paginatedData.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
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

              {showDeleteColumn && (
                <button
                  onClick={() => handleConfirmModal(row.id)}
                  className="text-red-400 text-sm mt-2"
                >
                  <i className="fa-solid fa-trash mr-1" />
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500">
            No records found
          </div>
        )}
      </div>

      {/* ---------------- Desktop Table ---------------- */}
      <div className="relative w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <table className="min-w-full w-max text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-black/90 backdrop-blur-xl">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-sm uppercase text-[#ffd700] whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}

              {showDeleteColumn && (
                <th className="px-6 py-3 text-sm uppercase text-[#ffd700] whitespace-nowrap">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {paginatedData?.length ? (
              paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-white/10 transition">
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className="px-6 py-3 text-sm text-slate-200 whitespace-nowrap"
                    >
                      {col.Cell
                        ? col.Cell({ value: row[col.accessor], row })
                        : row[col.accessor]}
                    </td>
                  ))}

                  {showDeleteColumn && (
                    <td className="px-6 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleConfirmModal(row.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-slate-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      {showPagination && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700"
            >
              {[10, 50, 100, 150].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 min-w-[80px] bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-30"
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
              disabled={
                currentPage >= Math.ceil(filteredData.length / entriesPerPage)
              }
              className="px-4 py-2 min-w-[80px] bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-30"
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
