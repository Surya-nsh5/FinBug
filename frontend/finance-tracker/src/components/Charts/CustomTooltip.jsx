import React from 'react'
import { addThousandsSeparator } from '../../utils/helper';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = Number(payload[0].value) || 0;
    return (
      <div className="bg-[var(--color-card)] shadow-md rounded-lg p-3 border border-[var(--color-border)]">
        <p className="text-sm font-semibold text-[var(--color-text)] mb-1">{payload[0].name}</p>
        <p className="text-sm text-[var(--color-text)] opacity-70">
          Amount: <span className="text-sm font-medium text-[var(--color-text)]">₹{addThousandsSeparator(value)}</span>
        </p>
      </div>
    );
  }

  return null;
}

export default CustomTooltip