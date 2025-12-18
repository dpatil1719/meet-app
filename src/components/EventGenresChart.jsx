// src/components/EventGenresChart.jsx
import { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const EventGenresChart = ({ events = [] }) => {
  const [data, setData] = useState([]);

  // Genres to look for in event summaries
  const genres = useMemo(
    () => ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'],
    []
  );

  const colors = ['#DD0000', '#00AA88', '#3366FF', '#FF9900', '#AA33AA'];

  const getData = () => {
    if (!events.length) return [];
    return genres.map((genre) => {
      const filtered = events.filter(
        (e) => typeof e.summary === 'string' && e.summary.includes(genre)
      );
      return { name: genre, value: filtered.length };
    });
  };

  // Custom percentage labels on slices
  const renderCustomizedLabel = ({
    cx, cy, midAngle, outerRadius, percent, index,
  }) => {
    if (!percent) return null;
    const RADIAN = Math.PI / 180;
    const x = cx + outerRadius * Math.cos(-midAngle * RADIAN) * 1.07;
    const y = cy + outerRadius * Math.sin(-midAngle * RADIAN) * 1.07;
    return (
      <text
        x={x}
        y={y}
        fill={colors[index % colors.length]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 12 }}
      >
        {`${genres[index]} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    setData(getData());
  }, [`${events}`]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenresChart;
