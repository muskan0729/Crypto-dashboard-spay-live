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
    return (
      <Toggle
        defaultChecked={value === "Active"}
        onChange={handleChange}
        className="hover:scale-110 transition-transform duration-300"
      />
    );
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
            className="bg-[#00ffff]/20 hover:bg-[#00ffff]/40 text-[#00ffff] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-[0_0_10px_rgba(0,255,255,0.3)] backdrop-blur-sm transition transform hover:scale-105"
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
          item.sqno === sqno
            ? { ...item, status: checked ? "Active" : "Inactive" }
            : item
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
    <div className="p-4 space-y-6 bg-[#0a0a0f] min-h-screen">
      {/* Page Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] 
                      flex justify-between items-center p-4 transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)]">
        <h4 className="font-bold text-[#00ffff] text-xl tracking-wider z-10">
          Scheme Manager
        </h4>

        <Button
          className="bg-white/10 border border-[#00ffff]/50 text-[#00ffff] font-semibold px-4 py-2 rounded-2xl
                     shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:bg-white/20 hover:border-[#00ffff] transition-all duration-300 transform hover:scale-105 z-10"
          onClick={handleModal}
        >
          ADD NEW
        </Button>
      </div>

      {/* Scheme Modal */}
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
          rowClassName={(rowIndex) =>
            rowIndex % 2 === 0
              ? "bg-white/10 hover:bg-white/20 transition-all duration-300"
              : "bg-white/5 hover:bg-white/20 transition-all duration-300"
          }
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)]"
          paginationClassName="flex justify-end gap-2 mt-4"
          previousClassName="bg-[#00ffff]/30 hover:bg-[#00ffff]/50 text-[#00ffff] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition-all duration-300"
          nextClassName="bg-[#00ffff]/30 hover:bg-[#00ffff]/50 text-[#00ffff] px-3 py-1 rounded-xl shadow-sm cursor-pointer transition-all duration-300"
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
