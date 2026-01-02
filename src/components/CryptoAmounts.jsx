import React from "react";

/**
 * Props:
 * - amount: number (required) - the crypto amount
 * - maxDecimals: number (optional) - default 8
 * - symbol: string (optional) - crypto or currency symbol, e.g., "BTC" or "₹"
 */
const CryptoAmount = ({ amount, maxDecimals = 8, symbol = "" }) => {
    // Function to format number without scientific notation
    const formatCrypto = (value, maxDecimals = 8) => {
        // Convert string to number
        const num = typeof value === "string" ? parseFloat(value) : value;

        if (isNaN(num)) return "0"; // fallback if parsing fails
        if (num === 0) return "0";

        let fixed = num.toFixed(maxDecimals);
        fixed = fixed.replace(/\.?0+$/, "");

        // Handle very small numbers that become 0 after trimming
        if (parseFloat(fixed) === 0 && num !== 0) {
        const match = num.toFixed(maxDecimals).match(/0*(\d+)/);
        fixed = match ? "0." + "0".repeat(match.index - 2) + match[1] : "0";
        }

        return fixed;
    };


    return (
        <span title={amount}>
            {symbol} {formatCrypto(amount)}
        </span>
    );
};

export default CryptoAmount;