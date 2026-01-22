import Button from "./Button";

export const ConfirmModal = ({
  showConfirmModal,
  handleConfirmModal,
  action,
  heading,
  body,
}) => {
  return (
    <div>
      {showConfirmModal && (
        <div
          className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/80 backdrop-blur-sm
  "
          onClick={() => handleConfirmModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
      relative
      w-full max-w-lg mx-4
      bg-white/5 backdrop-blur-xl
      border border-white/10
      rounded-2xl
      shadow-2xl
      overflow-hidden
      transition-all
    "
          >
            {/* Header */}
            <div className="relative px-6 py-4">
              {/* Glow */}
              <div
                className="
          absolute inset-0
        
          blur-2xl opacity-80
        "
              />

              <div className="relative flex items-center justify-between">
                <h3
                  className="
            text-lg font-semibold tracking-wide
            text-[#FFD700]
            drop-shadow-[0_0_8px_rgba(255,215,0,0.35)]
          "
                >
                  {heading}
                </h3>

                <Button
                  onClick={() => handleConfirmModal(false)}
                  className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-black/30
            border border-white/10
            text-white
            transition-all duration-200
            hover:bg-red-500
            hover:scale-105
            hover:shadow-lg hover:shadow-red-500/40
            active:scale-95
          "
                >
                  <i className="fa-solid fa-xmark" />
                </Button>
              </div>

              {/* Divider */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm leading-relaxed text-white/70">{body}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <Button
                type="button"
                onClick={() => handleConfirmModal(false)}
                className="
          px-5 py-2
          text-sm font-medium
          rounded-xl
          bg-black/30
          border border-white/10
          text-white/70
          transition
          hover:bg-black/50
          hover:text-white
        "
              >
                No
              </Button>

              <Button
                onClick={action}
                type="button"
                className="
          px-6 py-2
          text-sm font-semibold
          rounded-xl
          bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400
          text-black
          shadow-lg
          transition-all duration-200
          hover:opacity-90
          hover:shadow-yellow-400/40
          active:scale-95
        "
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
