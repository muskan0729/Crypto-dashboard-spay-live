import { useState, useEffect } from "react";
import Table from "../components/Table";
import { SchemeModal } from "../components/SchemeModal";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { TOGGLE_STATUSES } from "../constants/Constants";
import { TableSkeleton } from "../components/TableSkeleton";

const Scheme = () => {
  const [showModal, setShowModal] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [editData, setEditData] = useState(null);

  const { data, loading, error, refetch } = useGet("/get-scheme");
  const { execute: updateStatus } = usePost("/update-scheme-status");

  const StatusToggle = ({ id, value, sqno, onToggle }) => {
    const handleChange = (checked) => {
      if (onToggle) onToggle(id, sqno, checked);
    };
    return <Toggle defaultChecked={value === "Active"} onChange={handleChange} />;
  };

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        id: item.id,
        sqno: index + 1,
        name: item.name,
        status: item.status ? "Active" : "Inactive",
        action: (
          <Button
            onClick={() => handleEdit(item)}
            className="bg-[#ffd700]/20 hover:bg-[#ffd700]/40 text-[#ffd700] text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg transition"
          >
            Edit
          </Button>
        ),
      }));
      setSchemeData(formattedData);
    }
  }, [data]);

  const handleModal = () => {
    setShowModal((prev) => !prev);
    if (showModal) setEditData(null);
  };

  const handleEdit = (scheme) => {
    setEditData(scheme);
    setShowModal(true);
  };

  const handleStatusToggle = async (id, sqno, checked) => {
    const res = await updateStatus({ scheme_id: id, status: checked });
    if (res) {
      setSchemeData((prev) =>
        prev.map((item) =>
          item.sqno === sqno ? { ...item, status: checked ? "Active" : "Inactive" } : item
        )
      );
    }
  };

  const schemecolumn = [
    { header: "SQ No", accessor: "sqno" },
    { header: "Name", accessor: "name" },
    {
      header: "Status",
      accessor: "status",
      Cell: ({ value, row }) => (
        <StatusToggle
          value={value}
          sqno={row.sqno}
          id={row.id}
          onToggle={handleStatusToggle}
        />
      ),
    },
    { header: "Action", accessor: "action" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}

            
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex justify-between items-center p-4">
        
          <h4 className="font-bold text-[#ffd700] text-xl z-10">Scheme Manager</h4>
        <Button
          className="bg-white/10 border border-[#ffd700]/50 text-[#ffd700] font-semibold px-4 py-2 rounded-2xl shadow-md hover:bg-white/20 hover:border-[#ffd700] transition-all duration-200 z-10"
          onClick={handleModal}
        >
          ADD NEW
        </Button>
      </div>

      <SchemeModal
        showModal={showModal}
        handleModal={handleModal}
        editData={editData}
        refreshTable={refetch}
      />

      {/* Table */}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-center py-6 text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={schemecolumn}
          data={schemedata}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          rowClassName={(rowIndex) =>
            rowIndex % 2 === 0
              ? "bg-white/10 hover:bg-white/20 transition"
              : "bg-white/5 hover:bg-white/20 transition"
          }
          paginationClassName="flex justify-end gap-2 mt-4"
          previousClassName="bg-[#ffd700]/30 hover:bg-[#ffd700]/50 text-[#ffd700] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition"
          nextClassName="bg-[#ffd700]/30 hover:bg-[#ffd700]/50 text-[#ffd700] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition"
          showDateFilter={false}
          endPoint="/delete-scheme"
          refreshTable={refetch}
          statusList={TOGGLE_STATUSES}
        />
      )}
    </div>
  );
};

export default Scheme;
