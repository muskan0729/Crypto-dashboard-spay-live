import { useState, useMemo, useEffect, useRef } from "react";
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
  showExport = true,
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
  const [openExport, setOpenExport] = useState(false);
  const exportRef = useRef(null);
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
        if (setData) {
          setData((prev) => prev.filter((row) => row.id !== recordId));
        }
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

      const matchesStatus =
        statusFilter === "all" ||
        String(row.status).toLowerCase() === statusFilter.toLowerCase();

      const rowDate = new Date(row.date?.split("-")[0]);
      const matchesDate =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);

      const matchesMerchant =
        !selectedMerchant || row.user_id === selectedMerchant.value;

      setCurrentPage(1);
      return matchesSearch && matchesStatus && matchesDate && matchesMerchant;
    });
  }, [search, statusFilter, startDate, endDate, selectedMerchant, data]);

  return (
    <div className="w-full space-y-6">
      {/* FILTER BAR */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-3">
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="w-56 px-4 py-2 rounded-lg bg-black/50 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
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
                className="bg-black/50 border border-white/20 rounded-lg"
              />
            )}

            {showDateFilter && (
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  placeholderText="Start Date"
                  className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white"
                />
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  placeholderText="End Date"
                  className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white"
                />
              </div>
            )}

            {showStatusFilter && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-black/50 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All</option>
                {statusList?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead className="bg-black/40">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-sm font-semibold text-[#ffd700]"
                >
                  {col.header}
                </th>
              ))}
              {showDeleteColumn && (
                <th className="px-4 py-3 text-sm font-semibold text-[#ffd700]">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData?.length ? (
              filteredData
                .slice(
                  (currentPage - 1) * entriesPerPage,
                  currentPage * entriesPerPage
                )
                .map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className="px-4 py-3">
                        {col.Cell
                          ? col.Cell({ value: row[col.accessor], row })
                          : row[col.accessor]}
                      </td>
                    ))}
                    {showDeleteColumn && (
                      <td className="px-4 py-3">
                        <Button
                          onClick={() => handleConfirmModal(row.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <i className="fa-solid fa-trash" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-white/70"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {showPagination && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-white/10">
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-black/50 text-white px-2 py-1 rounded"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((p) =>
                    p <
                    Math.ceil(filteredData.length / entriesPerPage)
                      ? p + 1
                      : p
                  )
                }
              >
                Next
              </Button>
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
