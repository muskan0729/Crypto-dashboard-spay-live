import { useState, useMemo, useEffect } from "react";
import Button from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomSelect } from "./CustomSelect";

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
}) => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectData, setSelectData] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

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
        if (setData)
          setData((prev) => prev.filter((row) => row.id !== recordId));
        if (refreshTable) refreshTable();
        setShowConfirmModal(false);
        setRecordId(null);
      }
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  const filteredData = useMemo(() => {
    return data?.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      // const matchesStatus = !statusFilter || statusFilter === "all" ||
      //   String(row.status).toLowerCase() === statusFilter.toLowerCase();

      const matchesStatus = statusFilter === "all" || (row.status && String(row.status).toLowerCase() === statusFilter);
      
      const rowDate = new Date(row.date?.split("-")[0]);
      
      const matchesDate =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);
      
        const matchesMerchant =
          !selectedMerchant || row.user_id === selectedMerchant.value;

        return matchesSearch && matchesStatus && matchesDate && matchesMerchant;
      });
    }, [search, statusFilter, startDate, endDate, selectedMerchant, data]);
      
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, startDate, endDate, selectedMerchant]);

  return (
    <div className="w-full space-y-6 text-white p-4 ">
      {/* Glow Effects */}
      {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#1a3299] to-[#03c5fc] blur-[120px] opacity-20 -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#03c5fc] blur-[150px] opacity-10 -z-10" /> */}

      {/* Filter Bar */}
      <div className="">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-wrap gap-4 w-full">
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:ring-1 focus:ring-[#ffd700] outline-none transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}

            {showSelectUserFilter && (
              <CustomSelect
                options={selectData}
                placeholder="Select Merchant"
                value={selectedMerchant}
                onChange={setSelectedMerchant}
                className="w-full sm:w-64"
              />
            )}

            {showDateFilter && (
              <div className="flex gap-2 items-center">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  portalId="root-portal"
                  className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white w-full sm:w-auto focus:ring-1 focus:ring-[#ffd700] outline-none cursor-pointer"
                />
                <span className="text-slate-400">to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  portalId="root-portal"
                  className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white w-full sm:w-auto focus:ring-1 focus:ring-[#ffd700] outline-none cursor-pointer"
                />
              </div>
            )}

            {/* {showStatusFilter && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white w-full sm:w-auto focus:ring-1 focus:ring-[#ffd700] outline-none"
              >
                <option value="all">All Status</option>
                {statusList?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )} */}

            {showStatusFilter && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 hover:shadow-sm transition duration-300"
              >
                <option value="all">All</option> {/* MUST be lowercase to match initial state */}
                {statusList?.map((item, index) => (
                  <option key={index} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="">
        <div className="rounded-t-2xl  backdrop-blur-xl border border-white/10 shadow-xl overflow-x-auto overflow-y-auto relative">
          <table className="min-w-full text-left border-collapse ">
            <thead>
              <tr className="bg-white/10 border-b border-white/10">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 sm:px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#ffd700]"
                  >
                    {col.header}
                  </th>
                ))}
                {showDeleteColumn && (
                  <th className="px-4 sm:px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#ffd700]">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredData?.length ? (
                filteredData
                  .slice(
                    (currentPage - 1) * entriesPerPage,
                    currentPage * entriesPerPage
                  )
                  .map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-white/10 transition-colors"
                    >
                      {columns.map((col, i) => (
                        <td
                          key={i}
                          className="px-4 sm:px-6 py-3 text-sm text-slate-200 break-words"
                        >
                          {col.Cell
                            ? col.Cell({ value: row[col.accessor], row })
                            : row[col.accessor]}
                        </td>
                      ))}
                      {showDeleteColumn && (
                        <td className="px-4 sm:px-6 py-3">
                          <button
                            onClick={() => handleConfirmModal(row.id)}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
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

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 bg-black/80 border-t border-gray-800 gap-4 rounded-b-2xl">
            {/* Entries Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="bg-gray-900 text-white px-3 py-1 rounded-lg border border-gray-700 outline-none focus:ring-1 focus:ring-yellow-500 transition"
              >
                {[10, 50, 100, 150].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 rounded-lg border border-gray-700 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-30 transition"
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
                className="px-3 sm:px-4 py-1.5 rounded-lg border border-gray-700 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-30 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
