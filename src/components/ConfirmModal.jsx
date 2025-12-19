import Button from "./Button";

export const ConfirmModal = ({showConfirmModal, handleConfirmModal, action, heading, body}) => {
  return (
   <div>
  {showConfirmModal && (
    <div
      className="fixed inset-0 flex items-center justify-center 
                 bg-black/70 backdrop-blur-md z-50"
      onClick={() => handleConfirmModal(false)}
    >
      <div
        className="w-full max-w-lg mx-4 
                   rounded-xl 
                   bg-gradient-to-b from-black via-[#0b0b0b] to-black
                   border border-[#d4af37]/40
                   shadow-[0_0_30px_rgba(212,175,55,0.25)]
                   transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 
                     rounded-t-xl 
                     bg-gradient-to-r from-[#1a1a1a] to-black
                     border-b border-[#d4af37]/40"
        >
          <h3 className="text-lg font-semibold text-[#d4af37] tracking-wide">
            {heading}
          </h3>

          <Button
            onClick={() => handleConfirmModal(false)}
            className="flex items-center justify-center 
                       w-8 h-8 rounded-full 
                       bg-black border border-[#d4af37]
                       text-[#d4af37]
                       hover:bg-[#d4af37] hover:text-black
                       transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </Button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button
            type="button"
            onClick={() => handleConfirmModal(false)}
            className="px-5 py-2 text-sm font-medium 
                       rounded-lg 
                       border border-[#d4af37]/40
                       text-[#d4af37]
                       bg-black
                       hover:bg-[#1a1a1a]
                       transition"
          >
            No
          </Button>

          <Button
            onClick={action}
            type="button"
            className="px-6 py-2 text-sm font-semibold 
                       rounded-lg 
                       bg-gradient-to-r from-[#d4af37] to-[#b8962e]
                       text-black
                       hover:opacity-90
                       transition"
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
