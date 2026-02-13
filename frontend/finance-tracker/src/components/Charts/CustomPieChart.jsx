import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import { useTheme } from '../../context/ThemeContext';

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor, legendData }) => {
  const { isDarkMode } = useTheme();

  // Ensure data is an array and has valid entries
  const chartData = Array.isArray(data) && data.length > 0
    ? data.filter(item => item && item.amount > 0)
    : [];

  // Ensure colors array exists
  const chartColors = colors || ["#875cf5", "#FF6900", "#FA2C37"];

  // Detect desktop view for larger chart
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If no valid data, show placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ minHeight: isDesktop ? '450px' : '300px' }}>
        <div className="text-center">
          <p className="text-[var(--color-text)] opacity-40 text-sm">No data available</p>
          <p className="text-[var(--color-text)] opacity-30 text-xs mt-1">Add data to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minHeight: isDesktop ? '400px' : '300px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height={isDesktop ? 400 : 250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isDesktop ? 150 : 100}
            innerRadius={showTextAnchor ? (isDesktop ? 110 : 70) : 0}
            labelLine={false}
            startAngle={90}
            endAngle={-270}
            animationDuration={200}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
                stroke={isDarkMode ? "#1e293b" : "#fff"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />

          {showTextAnchor && (
            <>
              <text
                x="50%"
                y="50%"
                dy={isDesktop ? -30 : -20}
                textAnchor="middle"
                fill={isDarkMode ? '#94a3b8' : '#9CA3AF'}
                fontSize={isDesktop ? "18px" : "14px"}
                fontWeight="500"
                dominantBaseline="middle"
              > {label}
              </text>
              <text
                x="50%"
                y="50%"
                dy={isDesktop ? 15 : 8}
                textAnchor="middle"
                fill={isDarkMode ? '#f8fafc' : '#111827'}
                fontSize={isDesktop ? "36px" : "24px"}
                fontWeight="bold"
                dominantBaseline="middle"
              > {totalAmount}
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
      {legendData && legendData.length > 0 && (
        <div className={isDesktop ? "mt-6" : ""}>
          <CustomLegend payload={legendData.map(item => ({ value: item.name, color: item.color }))} />
        </div>
      )}
    </div>
  );
};

export default CustomPieChart