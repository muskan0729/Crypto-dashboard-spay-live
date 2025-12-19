import React, { useState } from "react";

const DashboardCards = ({ cards }) => {
  // Track Total / Today for each card type
  const [activeType, setActiveType] = useState(
    cards.reduce((acc, card) => {
      acc[card.type] = "total"; // default to total
      return acc;
    }, {})
  );

  return (
    <div className="lg:col-span-2 p-6 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(144,238,144,0.25)] flex flex-col gap-4">
      {cards.map((card, i) => {
        const isTotalActive = activeType[card.type] === "total";
        const displayedTitle = isTotalActive ? card.totalTitle : card.todayTitle;
        const displayedValue = isTotalActive ? card.value : card.todayValue;

        return (
          <div
            key={i}
            className="card card-block card-stretch custom-scroll bg-black/80 rounded-xl"
          >
            {/* Card header */}
            <div className="card-header d-flex flex-wrap justify-content-between items-center gap-3 px-4 py-3 border-b border-[#433200]">
              <h5 className="text-base sm:text-lg font-semibold text-[#D4AF37]">
                {displayedTitle}
              </h5>

              <div className="flex gap-2">
                <button
                  className={`px-2 py-1 text-xs rounded border ${
                    isTotalActive
                      ? "bg-[#02030a] text-[#D4AF37] border-[#433200]"
                      : "bg-transparent text-gray-400 border-gray-600"
                  }`}
                  onClick={() =>
                    setActiveType((prev) => ({ ...prev, [card.type]: "total" }))
                  }
                >
                  Total
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded border ${
                    !isTotalActive
                      ? "bg-[#02030a] text-[#D4AF37] border-[#433200]"
                      : "bg-transparent text-gray-400 border-gray-600"
                  }`}
                  onClick={() =>
                    setActiveType((prev) => ({ ...prev, [card.type]: "today" }))
                  }
                >
                  Today
                </button>
              </div>
            </div>

            {/* Card body */}
            <div className="card-body px-5 py-6 flex justify-between items-start">
              {/* Left column */}
              <div>
                <h6 className="text-2xl font-bold text-[#D4AF37] leading-none">
                  ₹{" "}
                  {displayedValue?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </h6>
                <div className="text-green-500 text-xs font-semibold mt-1">+64%</div>
              </div>

              {/* Chart placeholder with ref */}
              <div
                ref={card.ref}
                className="w-[200px] h-[80px]"
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
