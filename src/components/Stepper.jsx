import React from "react";

export const Stepper = ({ currentStep }) => {
  const activeText = "text-[#FFD700]";
  const inactiveText = "text-gray-500";
  const activeBorder = "border-[#FFD700]";
  const inactiveBorder = "border-gray-500";

  return (
    <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse justify-evenly mb-5">
      {[1, 2, 3, 4].map((step) => (
        <li
          key={step}
          className={`flex items-center space-x-2.5 rtl:space-x-reverse ${
            currentStep === step ? activeText : inactiveText
          }`}
        >
          <span
            className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${
              currentStep === step ? activeBorder : inactiveBorder
            }`}
          >
            {step}
          </span>
          <span>
            <h3 className="font-medium leading-tight">
              {step === 1 && "Merchant Info"}
              {step === 2 && "Company Info"}
              {step === 3 && "Director Info"}
              {step === 4 && "Scheme Selection"}
            </h3>
          </span>
        </li>
      ))}
    </ol>
  );
};
