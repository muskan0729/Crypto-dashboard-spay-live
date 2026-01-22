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
            bg-black/70
            backdrop-blur-xl
            transition-all
          "
          onClick={() => handleConfirmModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-lg mx-4
              bg-white/5 backdrop-blur-sm
              border border-cyan-400/20
              rounded-2xl
              overflow-hidden
              shadow-[0_0_60px_-10px_rgba(34,211,238,0.35)]
              transition-all duration-300
            "
          >
            {/* Header */}
            <div className="relative px-6 py-4">
              {/* Neon glow layer */}
              <div className="
                absolute inset-0
                bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-cyan-500/20
                blur-xl
                rounded-2xl
                -z-10
              "/>

              <div className="relative flex items-center justify-between">
                <h3 className="
                  text-lg font-bold tracking-wide
                  text-cyan-300
                  drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]
                ">
                  {heading}
                </h3>

                <Button
                  onClick={() => handleConfirmModal(false)}
                  className="
                    w-9 h-9 flex items-center justify-center
                    rounded-full
                    bg-black/40
                    border border-cyan-400/30
                    text-cyan-300
                    transition-all duration-200
                    hover:bg-cyan-400/20
                    hover:scale-110
                    hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]
                    active:scale-95
                  "
                >
                  <i className="fa-solid fa-xmark" />
                </Button>
              </div>

              {/* Divider */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="
                text-sm leading-relaxed text-cyan-100/70
                tracking-wide
                drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]
              ">
                {body}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <Button
                type="button"
                onClick={() => handleConfirmModal(false)}
                className="
                  px-5 py-2 text-sm font-medium tracking-wide
                  rounded-xl
                  bg-black/40 border border-cyan-400/20
                  text-cyan-100/70
                  transition-all duration-200
                  hover:bg-black/60 hover:text-cyan-200
                  hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
                  active:scale-95
                "
              >
                No
              </Button>

              <Button
                onClick={action}
                type="button"
                className="
                  px-6 py-2 text-sm font-semibold tracking-wide
                  rounded-xl
                  bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400
                  text-black
                  shadow-[0_0_40px_rgba(34,211,238,0.6)]
                  transition-all duration-300
                  hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.85)]
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
