import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, MapPin, Users, Store } from 'lucide-react';
import { calculateMoMChange } from '../data/mock';

const StoreStatistics = ({ data, stateWiseData, topStores }) => {
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Colors for charts
  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  // Top 10 states by store count
  const top10States = stateWiseData
    .sort((a, b) => b.storeCount - a.storeCount)
    .slice(0, 10);

  // Monthly store growth data
  const storeGrowthData = data.map((item, index) => ({
    ...item,
    storeGrowth: index > 0 ? item.totalStores - data[index - 1].totalStores : 0
  }));

  // Revenue trend data
  const revenueTrendData = data.map(item => ({
    month: item.shortMonth,
    revenue: item.totalRevenue / 10000000, // Convert to crores
    headcount: item.totalHeadcount
  }));

  const StateCard = ({ state, storeCount, headcount, revenue, storeCountChange, headcountChange, revenueChange }) => {
    return (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">{state}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Stores</p>
              <p className="font-semibold">{storeCount}</p>
              <div className="flex items-center">
                {storeCountChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${storeCountChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {storeCountChange}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Staff</p>
              <p className="font-semibold">{headcount}</p>
              <div className="flex items-center">
                {headcountChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${headcountChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {headcountChange}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <p className="font-semibold">{formatCurrency(revenue).slice(0, -3)}L</p>
              <div className="flex items-center">
                {revenueChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Store Count by State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Store Count by State (Top 10)</span>
          </CardTitle>
          <CardDescription>
            Distribution of stores across top performing states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={top10States}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="state" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'storeCount' ? 'Stores' : name
                ]}
                labelFormatter={(label) => `State: ${label}`}
              />
              <Bar 
                dataKey="storeCount" 
                fill="#3b82f6" 
                name="Store Count"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue & Headcount Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>
              Monthly revenue performance (in Crores)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value.toFixed(1)}Cr`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Headcount Trend</span>
            </CardTitle>
            <CardDescription>
              Total employee count across all stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatNumber(value), 'Employees']}
                />
                <Line 
                  type="monotone" 
                  dataKey="headcount" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* State-wise Performance Grid */}
      <Card>
        <CardHeader>
          <CardTitle>State-wise Performance Overview</CardTitle>
          <CardDescription>
            Detailed view of store performance across all states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stateWiseData.map((state, index) => (
              <StateCard
                key={state.state}
                {...state}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Stores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Performing Stores</CardTitle>
            <CardDescription>
              Revenue distribution among highest performing stores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={topStores.map((store, index) => ({
                    name: `${store.name} (${store.state})`,
                    value: store.revenue,
                    fill: chartColors[index % chartColors.length],
                    change: store.revenueChange
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topStores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    formatCurrency(value),
                    props.payload.name,
                    `Change: ${props.payload.change >= 0 ? '+' : ''}${props.payload.change}%`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Performance Details</CardTitle>
            <CardDescription>
              Detailed breakdown with month-over-month changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {topStores.map((store, index) => (
                <div 
                  key={store.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <div>
                      <p className="font-semibold text-sm">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.state}, {store.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(store.revenue)}</p>
                    <div className="flex items-center space-x-1">
                      {store.revenueChange >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${store.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {store.revenueChange}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreStatistics;