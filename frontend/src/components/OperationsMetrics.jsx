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
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  UserMinus, 
  DollarSign,
  PiggyBank,
  Receipt,
  Shield,
  FileText
} from 'lucide-react';
import { calculateMoMChange } from '../data/mock';

const OperationsMetrics = ({ data, currentMonth, previousMonth }) => {
  
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

  // Calculate MoM changes for all metrics
  const metrics = {
    netAddition: {
      value: currentMonth.netEmployeeAddition,
      change: calculateMoMChange(currentMonth.netEmployeeAddition, previousMonth.netEmployeeAddition)
    },
    netReduction: {
      value: currentMonth.netEmployeeReduction,
      change: calculateMoMChange(currentMonth.netEmployeeReduction, previousMonth.netEmployeeReduction)
    },
    grossEarnings: {
      value: currentMonth.grossEarnings,
      change: calculateMoMChange(currentMonth.grossEarnings, previousMonth.grossEarnings)
    },
    netPayable: {
      value: currentMonth.netPayable,
      change: calculateMoMChange(currentMonth.netPayable, previousMonth.netPayable)
    },
    pfPayable: {
      value: currentMonth.pfPayable,
      change: calculateMoMChange(currentMonth.pfPayable, previousMonth.pfPayable)
    },
    ptPayable: {
      value: currentMonth.ptPayable,
      change: calculateMoMChange(currentMonth.ptPayable, previousMonth.ptPayable)
    },
    esicPayable: {
      value: currentMonth.esicPayable,
      change: calculateMoMChange(currentMonth.esicPayable, previousMonth.esicPayable)
    },
    itPayable: {
      value: currentMonth.itPayable,
      change: calculateMoMChange(currentMonth.itPayable, previousMonth.itPayable)
    }
  };

  // Prepare data for employee movement chart
  const employeeMovementData = data.map(item => ({
    month: item.shortMonth,
    additions: item.netEmployeeAddition > 0 ? item.netEmployeeAddition : 0,
    reductions: item.netEmployeeReduction,
    netChange: item.netEmployeeAddition - item.netEmployeeReduction
  }));

  // Prepare data for payroll components
  const payrollData = data.map(item => ({
    month: item.shortMonth,
    gross: item.grossEarnings / 1000000, // Convert to millions
    net: item.netPayable / 1000000,
    pf: item.pfPayable / 100000, // Convert to lakhs
    pt: item.ptPayable / 100000,
    esic: item.esicPayable / 100000,
    it: item.itPayable / 100000
  }));

  // Prepare data for deductions breakdown
  const deductionsData = data.map(item => ({
    month: item.shortMonth,
    pf: item.pfPayable / 100000,
    pt: item.ptPayable / 100000,
    esic: item.esicPayable / 100000,
    it: item.itPayable / 100000
  }));

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number', description }) => {
    const isPositive = parseFloat(change) >= 0;
    const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);
    
    return (
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <Badge 
              variant={isPositive ? "default" : "destructive"} 
              className={`${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {change}% from last month
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Employee Movement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Net Employee Addition"
          value={metrics.netAddition.value}
          change={metrics.netAddition.change}
          icon={UserPlus}
          description="New hires this month"
        />
        <MetricCard
          title="Net Employee Reduction"
          value={metrics.netReduction.value}
          change={metrics.netReduction.change}
          icon={UserMinus}
          description="Departures this month"
        />
      </div>

      {/* Employee Movement Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Employee Movement Trend</span>
          </CardTitle>
          <CardDescription>
            Monthly addition and reduction of employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={employeeMovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="additions" fill="#10b981" name="Additions" />
              <Bar dataKey="reductions" fill="#ef4444" name="Reductions" />
              <Line 
                type="monotone" 
                dataKey="netChange" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Net Change"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payroll Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gross Earnings Payable"
          value={metrics.grossEarnings.value}
          change={metrics.grossEarnings.change}
          icon={DollarSign}
          format="currency"
          description="Total gross salary"
        />
        <MetricCard
          title="Net Payable"
          value={metrics.netPayable.value}
          change={metrics.netPayable.change}
          icon={DollarSign}
          format="currency"
          description="After all deductions"
        />
        <MetricCard
          title="Provident Fund"
          value={metrics.pfPayable.value}
          change={metrics.pfPayable.change}
          icon={PiggyBank}
          format="currency"
          description="PF contributions"
        />
        <MetricCard
          title="Professional Tax"
          value={metrics.ptPayable.value}
          change={metrics.ptPayable.change}
          icon={Receipt}
          format="currency"
          description="PT deductions"
        />
      </div>

      {/* Additional Payroll Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="ESIC Payable"
          value={metrics.esicPayable.value}
          change={metrics.esicPayable.change}
          icon={Shield}
          format="currency"
          description="Employee State Insurance"
        />
        <MetricCard
          title="Income Tax Payable"
          value={metrics.itPayable.value}
          change={metrics.itPayable.change}
          icon={FileText}
          format="currency"
          description="TDS deductions"
        />
      </div>

      {/* Payroll Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gross vs Net Earnings Trend</CardTitle>
            <CardDescription>
              Monthly comparison of gross and net payables (in Crores)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₹${value.toFixed(1)}Cr`, 
                    name === 'gross' ? 'Gross Earnings' : 'Net Payable'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="gross" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Gross"
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Net"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deductions Breakdown</CardTitle>
            <CardDescription>
              Monthly deductions by category (in Lakhs)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deductionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₹${value.toFixed(1)}L`, 
                    name.toUpperCase()
                  ]}
                />
                <Bar dataKey="pf" stackId="a" fill="#8b5cf6" name="PF" />
                <Bar dataKey="pt" stackId="a" fill="#f59e0b" name="PT" />
                <Bar dataKey="esic" stackId="a" fill="#ef4444" name="ESIC" />
                <Bar dataKey="it" stackId="a" fill="#06b6d4" name="IT" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Month Payroll Summary</CardTitle>
          <CardDescription>
            Detailed breakdown of all payroll components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Component</th>
                  <th className="text-right p-3 font-semibold">Current Month</th>
                  <th className="text-right p-3 font-semibold">Previous Month</th>
                  <th className="text-right p-3 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Gross Earnings', current: currentMonth.grossEarnings, previous: previousMonth.grossEarnings },
                  { name: 'Net Payable', current: currentMonth.netPayable, previous: previousMonth.netPayable },
                  { name: 'Provident Fund', current: currentMonth.pfPayable, previous: previousMonth.pfPayable },
                  { name: 'Professional Tax', current: currentMonth.ptPayable, previous: previousMonth.ptPayable },
                  { name: 'ESIC', current: currentMonth.esicPayable, previous: previousMonth.esicPayable },
                  { name: 'Income Tax', current: currentMonth.itPayable, previous: previousMonth.itPayable },
                ].map((row, index) => {
                  const change = calculateMoMChange(row.current, row.previous);
                  const isPositive = parseFloat(change) >= 0;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{row.name}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.current)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(row.previous)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {change}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationsMetrics;