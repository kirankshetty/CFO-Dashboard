import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  DollarSign, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { 
  monthlyData, 
  stateWiseStores, 
  topStores, 
  calculateMoMChange, 
  currentMonthData, 
  previousMonthData,
  indianStates 
} from '../data/mock';
import StoreStatistics from './StoreStatistics';
import OperationsMetrics from './OperationsMetrics';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12');
  const [selectedStates, setSelectedStates] = useState([]);
  const [dateRange, setDateRange] = useState('current');

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const months = parseInt(selectedPeriod);
    return monthlyData.slice(-months);
  }, [selectedPeriod]);

  // Calculate key metrics with MoM changes
  const keyMetrics = useMemo(() => {
    return {
      totalStores: {
        value: currentMonthData.totalStores,
        change: calculateMoMChange(currentMonthData.totalStores, previousMonthData.totalStores)
      },
      totalEmployees: {
        value: currentMonthData.totalHeadcount,
        change: calculateMoMChange(currentMonthData.totalHeadcount, previousMonthData.totalHeadcount)
      },
      totalRevenue: {
        value: currentMonthData.totalRevenue,
        change: calculateMoMChange(currentMonthData.totalRevenue, previousMonthData.totalRevenue)
      },
      grossEarnings: {
        value: currentMonthData.grossEarnings,
        change: calculateMoMChange(currentMonthData.grossEarnings, previousMonthData.grossEarnings)
      }
    };
  }, []);

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

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
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

  const handleExport = () => {
    // Mock export functionality
    const dataToExport = {
      keyMetrics,
      monthlyData: filteredData,
      stateWiseData: stateWiseStores,
      topStores
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CFO_Dashboard_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CFO Dashboard</h1>
            <p className="text-muted-foreground">
              Retail Chain Management - 800+ Stores | 5400+ Employees
            </p>
          </div>
          
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 months</SelectItem>
                <SelectItem value="6">Last 6 months</SelectItem>
                <SelectItem value="12">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Stores"
            value={keyMetrics.totalStores.value}
            change={keyMetrics.totalStores.change}
            icon={Store}
          />
          <MetricCard
            title="Total Employees"
            value={keyMetrics.totalEmployees.value}
            change={keyMetrics.totalEmployees.change}
            icon={Users}
          />
          <MetricCard
            title="Total Revenue"
            value={keyMetrics.totalRevenue.value}
            change={keyMetrics.totalRevenue.change}
            icon={DollarSign}
            format="currency"
          />
          <MetricCard
            title="Gross Earnings"
            value={keyMetrics.grossEarnings.value}
            change={keyMetrics.grossEarnings.change}
            icon={DollarSign}
            format="currency"
          />
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="store-stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store-stats">Store Statistics</TabsTrigger>
            <TabsTrigger value="operations">Operations Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="store-stats" className="space-y-6">
            <StoreStatistics 
              data={filteredData} 
              stateWiseData={stateWiseStores}
              topStores={topStores}
            />
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-6">
            <OperationsMetrics 
              data={filteredData}
              currentMonth={currentMonthData}
              previousMonth={previousMonthData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;