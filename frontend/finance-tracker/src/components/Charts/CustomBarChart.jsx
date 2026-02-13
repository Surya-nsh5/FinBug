import React, { useMemo } from "react";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { addThousandsSeparator } from "../../utils/helper";
import { useTheme } from "../../context/ThemeContext";

// Custom tick for XAxis to show date
const CustomizedAxisTick = (props) => {
  const { x, y, payload, index, isDarkMode } = props;

  // Try to parse as ISO date first, then fall back to other formats
  const momentDate = moment(payload.value, [moment.ISO_8601, "YYYY-MM-DD", "DD MMM YYYY"], true);
  const tickColor = isDarkMode ? "#94a3b8" : "#666";

  if (momentDate.isValid()) {
    const day = momentDate.format("D");
    const month = momentDate.format("MMM");

    // Show month on first tick or when month changes (check index)
    // const showMonth = index === 0 || momentDate.date() === 1;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill={tickColor} fontSize={10}>
          {month}
        </text>
      </g>
    );
  }

  // If not a valid date, just show the value as-is
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill={tickColor} fontSize={10}>
        {payload.value}
      </text>
    </g>
  );
};

// Format large numbers to shorter format (e.g., 1.3M, 500K)
const formatYAxisValue = (value) => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

// Truncate long labels for horizontal display - more aggressive truncation
const truncateLabel = (label, maxLength = 12) => {
  if (!label) return "";
  if (label.length <= maxLength) return label;
  return label.substring(0, maxLength - 3) + "...";
};

const CustomBarChart = React.memo(({ data = [], colors }) => {
  const { isDarkMode } = useTheme();
  // Memoize color function
  const getBarColor = useMemo(() => {
    const defaultColors = ["#875cf5", "#a78bfa", "#c4b5fd", "#ddd6fe"];
    const colorArray = colors && Array.isArray(colors) ? colors : defaultColors;
    return (index) => colorArray[index % colorArray.length];
  }, [colors]);



  // Calculate bottom margin - minimal space for horizontal labels
  const bottomMargin = useMemo(() => {
    if (!data || data.length === 0) return 15;
    if (data.length <= 3) return 5; // Minimal space for 3 bars or less
    return 15; // Minimal space for horizontal labels
  }, [data]);

  // Calculate XAxis height - minimal for horizontal labels
  const xAxisHeight = useMemo(() => {
    if (!data || data.length === 0) return 20;
    return 25; // Consistent height for horizontal labels
  }, [data]);

  // Memoize cells to prevent re-renders
  const barCells = useMemo(() => {
    if (!data || data.length === 0) return [];
    return (data || []).map((entry, index) => (
      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
    ));
  }, [data, getBarColor]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const source = payload[0].payload.source;
      const category = payload[0].payload.category;
      const name = payload[0].payload.name;
      const amount = payload[0].payload.amount || payload[0].value || 0;

      // Determine date label
      let dateLabel = name;
      // If name is a valid date, format it
      const momentDate = moment(name, [moment.ISO_8601, "YYYY-MM-DD", "DD MMM YYYY"], true);
      if (momentDate.isValid()) {
        dateLabel = momentDate.format("DD MMM");
      }

      // Show source/category name. If none, maybe it's aggregated by date so just show "Total" or similar?
      // But user said "name + expense or income"
      // Wait, usually the 'name' prop IS the date in these charts now.
      // And individual transactions might be lost in aggregation IF we aggregated.
      // But RecentIncomeWithChart aggregates by date.
      // So source/category might be missing.
      // If source/category is missing, we just show "Income" or "Expense"?
      // But wait, the user's request: "on hovering what date and name + expense or income"
      // If we only have date, "name" is ambiguous. Maybe they mean category name?
      // In aggregated views (where one bar = one day), a day can have multiple categories.
      // Our RecenIncomeWithChart aggregates: `amount: dataMap[date]`. It does NOT preserve source/category.
      // So we can only show "Income" or "Expense" based on context?
      // Or maybe "Total Income" / "Total Expense"?
      // Let's look at the tooltip. content.

      const isIncome = source !== undefined || (payload[0] && payload[0].fill === "#875cf5"); // Heuristic? Or pass type prop?
      // Or just check data structure.
      // If aggregated, we don't know the specific source.

      const label = source || category || (amount >= 0 ? "Income" : "Expense");

      return (
        <div className="bg-[var(--color-card)] shadow-lg rounded-lg p-3 border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text)] opacity-60 mb-1">
            {dateLabel}
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${source ? 'bg-green-500' : 'bg-purple-500'}`}></div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text)]">
                {label}
              </p>
              <p className="text-sm font-semibold text-purple-600">
                ₹{addThousandsSeparator(amount)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Detect desktop view for larger chart
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-text)] opacity-40">
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  const chartHeight = isDesktop ? "500px" : "380px";

  return (
    <div
      className="w-full overflow-visible"
      style={{ height: chartHeight, minHeight: chartHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data || []}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: bottomMargin,
          }}
          barCategoryGap={data.length <= 3 ? "25%" : "10%"}
        >
          <defs>
            <clipPath id="chart-clip">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#334155" : "#f3f4f6"}
            vertical={false}
            opacity={0.5}
          />

          <XAxis
            dataKey="name"
            tick={<CustomizedAxisTick isDarkMode={isDarkMode} />}
            stroke={isDarkMode ? "#475569" : "#e5e7eb"}
            axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
            height={xAxisHeight}
            dy={5}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDarkMode ? "#94a3b8" : "#6b7280", fontWeight: 500 }}
            stroke={isDarkMode ? "#475569" : "#e5e7eb"}
            axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb", strokeWidth: 1 }}
            tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
            domain={[0, "dataMax + 500"]}
            tickFormatter={formatYAxisValue}
            allowDuplicatedCategory={false}
            allowDataOverflow={false}
            width={60}
            dx={-5}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
          />
          <Bar
            dataKey="amount"
            radius={[6, 6, 0, 0]}
            animationDuration={200}
            animationEasing="ease-out"
          >
            {barCells}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

CustomBarChart.displayName = "CustomBarChart";

export default CustomBarChart;
