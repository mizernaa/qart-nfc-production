"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AnalyticsChartProps {
  data: Record<string, number>
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Convert data to chart format and sort by date
  const chartData = Object.entries(data)
    .map(([date, views]) => ({
      date,
      views,
      formattedDate: new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short'
      })
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30) // Last 30 days

  // Fill missing dates with 0 views
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
  
  const filledData = []
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const existingData = chartData.find(item => item.date === dateStr)
    
    filledData.push({
      date: dateStr,
      views: existingData?.views || 0,
      formattedDate: d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short'
      })
    })
  }

  if (filledData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Görüntülenecek veri yok
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filledData}>
          <XAxis 
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-blue-600">
                      Görüntülenme: {payload[0].value}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}