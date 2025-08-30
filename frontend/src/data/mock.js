// Mock data for CFO Dashboard

// Indian states data for heatmap and filters
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Generate mock store data
const generateStoreData = () => {
  const stores = [];
  let storeId = 1;
  
  indianStates.forEach(state => {
    const storeCount = Math.floor(Math.random() * 40) + 10; // 10-50 stores per state
    for (let i = 0; i < storeCount; i++) {
      stores.push({
        id: storeId++,
        name: `Store ${storeId - 1}`,
        state: state,
        headcount: Math.floor(Math.random() * 20) + 5, // 5-25 employees per store
        revenue: Math.floor(Math.random() * 500000) + 100000, // 1-6 lakh revenue
        city: `City ${i + 1}`
      });
    }
  });
  
  return stores;
};

export const storeData = generateStoreData();

// Generate monthly data for the last 12 months
const generateMonthlyData = () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    
    months.push({
      month: monthName,
      shortMonth: date.toLocaleDateString('en-IN', { month: 'short' }),
      // Store Statistics
      totalStores: 800 + Math.floor(Math.random() * 50) - 25,
      totalHeadcount: 5400 + Math.floor(Math.random() * 200) - 100,
      totalRevenue: 50000000 + Math.floor(Math.random() * 10000000) - 5000000, // 45-55 crores
      
      // Operations Metrics
      netEmployeeAddition: Math.floor(Math.random() * 100) - 50, // -50 to +50
      netEmployeeReduction: Math.floor(Math.random() * 80) + 10, // 10-90
      grossEarnings: 25000000 + Math.floor(Math.random() * 5000000), // 25-30 crores
      netPayable: 20000000 + Math.floor(Math.random() * 4000000), // 20-24 crores
      pfPayable: 1500000 + Math.floor(Math.random() * 300000), // 15-18 lakhs
      ptPayable: 300000 + Math.floor(Math.random() * 100000), // 3-4 lakhs
      esicPayable: 800000 + Math.floor(Math.random() * 200000), // 8-10 lakhs
      itPayable: 2500000 + Math.floor(Math.random() * 500000), // 25-30 lakhs
    });
  }
  
  return months;
};

export const monthlyData = generateMonthlyData();

// State-wise store distribution for heatmap
export const stateWiseStores = indianStates.map(state => {
  const storeCount = storeData.filter(store => store.state === state).length;
  const headcount = storeData.filter(store => store.state === state).reduce((acc, store) => acc + store.headcount, 0);
  const revenue = storeData.filter(store => store.state === state).reduce((acc, store) => acc + store.revenue, 0);
  
  return {
    state,
    storeCount,
    headcount,
    revenue,
    // Add percentage change (mock)
    storeCountChange: Math.floor(Math.random() * 20) - 10, // -10% to +10%
    headcountChange: Math.floor(Math.random() * 15) - 7.5, // -7.5% to +7.5%
    revenueChange: Math.floor(Math.random() * 25) - 12.5, // -12.5% to +12.5%
  };
});

// Top performing stores with realistic revenue distribution
export const topStores = storeData
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 10)
  .map((store, index) => {
    // Create a clear revenue hierarchy for top 10 stores
    const baseRevenue = 600000; // 6 lakhs base
    const revenueMultiplier = [
      2.5,  // Top store: 15L
      2.2,  // 2nd: 13.2L
      1.9,  // 3rd: 11.4L
      1.7,  // 4th: 10.2L
      1.5,  // 5th: 9L
      1.3,  // 6th: 7.8L
      1.1,  // 7th: 6.6L
      0.95, // 8th: 5.7L
      0.8,  // 9th: 4.8L
      0.65  // 10th: 3.9L
    ];
    
    return {
      ...store,
      revenue: Math.floor(baseRevenue * revenueMultiplier[index]),
      revenueChange: Math.floor(Math.random() * 30) - 15 // -15% to +15%
    };
  });

// Calculate month-over-month changes
export const calculateMoMChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

// Current month data (latest month)
export const currentMonthData = monthlyData[monthlyData.length - 1];
export const previousMonthData = monthlyData[monthlyData.length - 2];

// Export functions for filtering
export const filterDataByDateRange = (startDate, endDate) => {
  // Implementation for date range filtering
  return monthlyData.filter(data => {
    const dataDate = new Date(data.month);
    return dataDate >= startDate && dataDate <= endDate;
  });
};

export const filterDataByState = (selectedStates) => {
  if (!selectedStates.length) return stateWiseStores;
  return stateWiseStores.filter(data => selectedStates.includes(data.state));
};