import { useEffect, useState } from "react";
import Button from "../components/Button";
import Table from "../components/Table";
import Logo from "../images/logo.png";
import Placeholder from "../images/placeholder.jpeg";
import { useNavigate } from "react-router-dom";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { useToast } from "../contexts/ToastContext";

export const ViewComplain = () => {
  const [errors, setErrors] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [ticketData, setTicketData] = useState([]);
  const [editData, setEditData] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { execute: executeTicket, loading: creating } =
    usePost("/store-ticket");

  const [ticketFormData, setTicketFormData] = useState({
    user_id: "",
    subject: "",
    description: "",
    attachment: "",
    assigned_to: "",
  });

  const { data, refetch } = useGet("/get-tickets");
  const { execute: updateTicket, loading: updating } = usePost(
    editData ? `/update-ticket/${editData.id}` : ""
  );

  const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];
  const priorityOptions = ["High", "Medium", "Low"];

  const formatForUI = (str) => {
    if (!str) return "N/A";
    return str
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item) => ({
        id: item.id ?? "N/A",
        ticket_id: item.ticket_id ?? "N/A",
        user_name: item.user?.name ?? "N/A",
        subject: item.subject ?? "N/A",
        description: item.description ?? "N/A",
        status: formatForUI(item.status),
        priority: formatForUI(item.priority),
        assigned_to: item.assigned_to ?? "N/A",
        created_at: new Date(item.created_at).toLocaleString(),
        action: (
          <Button
            onClick={() => handleEdit(item)}
            className="bg-[#ffd700] hover:bg-yellow-400 text-black text-xs px-3 py-1.5 rounded-lg shadow"
          >
            Edit
          </Button>
        ),
      }));

      setTicketData(formattedData);
    }
  }, [data]);

  useEffect(() => {
    if (showModal) {
      if (editData) {
        setTicketFormData({
          user_id: editData.user_id || "",
          subject: editData.subject || "",
          description: editData.description || "",
          attachment: "",
          assigned_to: editData.assigned_to || "",
        });
      } else {
        setTicketFormData({
          user_id: "",
          subject: "",
          description: "",
          attachment: "",
          assigned_to: "",
        });
      }
    }
  }, [showModal, editData]);

  const handleEdit = (ticket) => {
    setEditData(ticket);
    setShowModal(true);
  };

  const complainColumns = [
    { header: "Complain Id", accessor: "ticket_id" },
    { header: "Name", accessor: "user_name" },
    { header: "Subject", accessor: "subject" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
    { header: "Priority", accessor: "priority" },
    { header: "Send Message", accessor: "send" },
    { header: "View Message", accessor: "view" },
    { header: "Issue Image", accessor: "image" },
    { header: "Assigned To", accessor: "assigned_to" },
    { header: "Created At", accessor: "created_at" },
    { header: "Action", accessor: "action" },
  ];

  const complainsWithModifications = ticketData.map((row) => ({
    ...row,
    status: (
      <select
        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:ring-2 focus:ring-[#ffd700]"
        value={row.status}
        onChange={(e) => {
          const newStatus = e.target.value;
          setTicketData((prev) =>
            prev.map((item) =>
              item.ticket_id === row.ticket_id
                ? { ...item, status: newStatus }
                : item
            )
          );
        }}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status} className="text-black">
            {status}
          </option>
        ))}
      </select>
    ),
    priority: (
      <select
        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:ring-2 focus:ring-[#ffd700]"
        value={row.priority}
        onChange={(e) => {
          const newPriority = e.target.value;
          setTicketData((prev) =>
            prev.map((item) =>
              item.ticket_id === row.ticket_id
                ? { ...item, priority: newPriority }
                : item
            )
          );
        }}
      >
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority} className="text-black">
            {priority}
          </option>
        ))}
      </select>
    ),
    send: (
      <Button
        onClick={() => setShowSendMessageModal(!showSendMessageModal)}
        className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg"
      >
        Send
      </Button>
    ),
    view: (
      <Button
        onClick={() => setShowViewMessageModal(!showViewMessageModal)}
        className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg"
      >
        View
      </Button>
    ),
    image: (
      <Button onClick={() => setShowImageModal(!showImageModal)}>
        <img src={Logo || Placeholder} alt="" className="w-8 h-8 rounded-md" />
      </Button>
    ),
  }));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTicketFormData({
      ...ticketFormData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ticketFormData };
      const res = editData
        ? await updateTicket(payload)
        : await executeTicket(payload);

      toast.success(
        editData
          ? "Complaint updated successfully!"
          : "Ticket submitted successfully!"
      );

      if (res) {
        setShowModal(false);
        refetch();
        navigate("/view-complain");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />
        <div className="relative flex justify-between items-center">
          <h4 className="text-xl font-bold text-[#53eafd]">View Complaint</h4>
          <Button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-[#53eafd]  text-black font-semibold px-4 py-2 rounded-lg"
          >
            Raise Complaint
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        className="
    relative
    bg-white/5 backdrop-blur-2xl
    border border-cyan-400/20
    rounded-2xl
    shadow-[0_0_50px_-15px_rgba(34,211,238,0.35)]
    p-4
    transition-all
  "
      >
        {complainsWithModifications?.length > 0 ? (
          <Table
            columns={complainColumns}
            data={complainsWithModifications}
            showStatusFilter={false}
            endPoint="/delete-ticket"
            setData={setTicketData}
          />
        ) : (
          <div
            className="
        flex flex-col items-center justify-center
        min-h-[220px]
        text-center
        rounded-xl
        bg-black/30
        border border-cyan-400/10
        backdrop-blur-xl
      "
          >
            {/* Glow */}
            <div
              className="
          absolute
          w-40 h-40
          bg-cyan-500/20
          blur-[90px]
          rounded-full
        "
            />

            <p
              className="
          relative
          text-cyan-300
          text-sm
          font-medium
          tracking-widest
          uppercase
          drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
        "
            >
              No Data Found
            </p>

            <span className="relative mt-2 text-xs text-cyan-100/50 tracking-wide">
              Waiting for records to appear
            </span>
          </div>
        )}
      </div>


      {/* All modals remain functionally identical – styling preserved */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex justify-between items-center px-6 py-4">
              {/* Gradient Glow Behind Header */}
              <div className="absolute inset-0  blur-2xl opacity-70 rounded-t-2xl" />
              <h2 className="relative text-xl font-bold text-[#53eafd] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                Complaint Form
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-black/30 border border-white/10 text-white transition-all hover:bg-red-500 hover:text-black hover:scale-105 active:scale-95"
              >
                X
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative p-6 space-y-4">
              {["user_id", "subject", "assigned_to"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={ticketFormData[field]}
                  onChange={handleChange}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#53eafd] transition"
                />
              ))}

              <textarea
                name="description"
                rows={4}
                value={ticketFormData.description}
                onChange={handleChange}
                placeholder="DESCRIPTION"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition"
              />

              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className="w-full text-white file:bg-[#53eafd] file:text-black file:px-4 file:py-2 file:rounded-md file:border-none transition"
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 text-black font-semibold py-2 rounded-2xl shadow-md hover:opacity-90 hover:shadow-lg transition"
              >
                {editData
                  ? updating
                    ? "Updating..."
                    : "Update"
                  : creating
                    ? "Submitting..."
                    : "Submit"}
              </Button>
            </form>
          </div>
        </div>

      )}
    </div>
  );
};
