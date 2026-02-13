import React, { useMemo } from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CustomLineChart = React.memo(({ data = [] }) => {
    const { isDarkMode } = useTheme();

    const CustomToolTip = React.useCallback(({ active, payload }) => {
        if (active && payload && payload.length) {
            const label = payload[0].payload.category || payload[0].payload.source || 'N/A';
            return (
                <div className="bg-[var(--color-card)] shadow-md rounded-lg p-2 border border-[var(--color-border)]">
                    <p className="text-xs font-semibold text-purple-600 mb-1">{label}</p>
                    <p className="text-sm text-[var(--color-text)] opacity-70">
                        Amount: <span className="text-sm font-medium text-[var(--color-text)]">₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            );
        }
        return null;
    }, []);

    // Memoize chart data to prevent unnecessary re-renders
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return [];
        }
        return data;
    }, [data]);

                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: isDarkMode ? "#94a3b8" : "#555" }}
                    stroke='none'
                    tickCount={8}
                    minTickGap={30}
                    angle={0}
                />
                <YAxis tick={{ fontSize: 12, fill: isDarkMode ? "#94a3b8" : "#555" }} stroke='none' />
                <Tooltip content={<CustomToolTip />} cursor={false} />

                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#875cf5"
                    fill="url(#incomeGradient)"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#ab8df8" }}
                    animationDuration={200}
                    animationEasing="ease-out"
                />
            </AreaChart >
        </ResponsiveContainer >
    </div >
});

CustomLineChart.displayName = 'CustomLineChart';

export default CustomLineChart