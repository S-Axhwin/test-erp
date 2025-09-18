import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  SumOfClosedPOBillingValue, 
  SumOfClosedPOCases, 
  SumOfGrnCases, 
  SumOfOpenPOBillingValue, 
  SumOfPOBillingValue, 
  SumOfPOCases,
  SumOfGrnBillValue,
  Mapping
} from '@/lib/calculation';

interface VendorPerformance {
  vendor: string;
  totalCases: number;
  open: number;
  closed: number;
  grn: number;
  billing: number;
  grnBilling: number;
}

interface MappedPO {
  vendor: string;
  status: string;
  poLineValueWithTax: number;
  grnBillValue: number;
  receivedQty: number;
  [key: string]: any;
}

interface RealTimeData {
  caseDistribution: Array<{ name: string; value: number; color: string }>;
  billingData: Array<{ name: string; value: number; color: string }>;
  vendorPerformance: VendorPerformance[];
  mappedData: MappedPO[];
}

// Mock data - replace with real data from your API
const trendData = [
  { name: 'Jan', cases: 1200, closed: 800, grn: 400 },
  { name: 'Feb', cases: 1400, closed: 900, grn: 500 },
  { name: 'Mar', cases: 1500, closed: 1000, grn: 600 },
  { name: 'Apr', cases: 1600, closed: 1100, grn: 700 },
  { name: 'May', cases: 1800, closed: 1200, grn: 800 },
  { name: 'Jun', cases: 1842, closed: 1245, grn: 843 },
];

const CaseAnalytics = () => {
  const { pos, openpos, landingRates } = useDataStore();
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  
  // Calculate real-time metrics
  useEffect(() => {
    const calculateMetrics = () => {
      const mappedData = Mapping();
      
      // Case distribution data
      const totalPOCases = SumOfPOCases();
      const closedPOCases = SumOfClosedPOCases();
      const grnCases = SumOfGrnCases();
      const openPOCases = (pos?.filter(po => po.status === 'open').length || 0) + (openpos?.length || 0);
      
      const caseDistribution = [
        { name: 'Total PO', value: totalPOCases, color: '#8b5cf6' },
        { name: 'Closed', value: closedPOCases, color: '#10b981' },
        { name: 'GRN', value: grnCases, color: '#f59e0b' },
        { name: 'Open', value: openPOCases, color: '#ef4444' }
      ];
      
      // Billing values data
      const billingData = [
        { name: 'PO Billing', value: SumOfPOBillingValue(), color: '#8b5cf6' },
        { name: 'Closed PO', value: SumOfClosedPOBillingValue(), color: '#10b981' },
        { name: 'GRN Billing', value: SumOfGrnBillValue(), color: '#f59e0b' },
        { name: 'Open PO', value: SumOfOpenPOBillingValue(), color: '#ef4444' }
      ];
      
      // Vendor performance from mapped data
      const vendorPerformance = mappedData ? getVendorPerformance(mappedData) : [];
      
      setRealTimeData({
        caseDistribution,
        billingData,
        vendorPerformance,
        mappedData: mappedData || []
      });
    };
    
    calculateMetrics();
    const interval = setInterval(calculateMetrics, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [pos, openpos, landingRates]);
  
  // Get vendor performance from mapped data
  const getVendorPerformance = (mappedData: MappedPO[]): VendorPerformance[] => {
    const vendorStats = mappedData.reduce((acc: Record<string, VendorPerformance>, item: MappedPO) => {
      const vendor = item.vendor || 'Unknown';
      if (!acc[vendor]) {
        acc[vendor] = {
          vendor,
          totalCases: 0,
          open: 0,
          closed: 0,
          grn: 0,
          billing: 0,
          grnBilling: 0
        };
      }
      
      acc[vendor].totalCases += 1;
      acc[vendor].billing += item.poLineValueWithTax || 0;
      acc[vendor].grnBilling += item.grnBillValue || 0;
      
      if (item.status === 'completed') acc[vendor].closed += 1;
      else if (item.status === 'open') acc[vendor].open += 1;
      if (item.receivedQty > 0) acc[vendor].grn += 1;
      
      return acc;
    }, {});
    
    return Object.values(vendorStats).slice(0, 10); // Top 10 vendors
  };
  
  // Format currency in rupees
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };
  
  // Update KPI data with real values
  const kpiData = [
    { id: 1, title: 'Sum of PO Cases', value: SumOfPOCases().toLocaleString(), change: '+12.5%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 2, title: 'Closed PO Cases', value: SumOfClosedPOCases().toLocaleString(), change: '+8.2%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 3, title: 'GRN Cases', value: SumOfGrnCases().toLocaleString(), change: '+5.7%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 4, title: 'Open PO Cases', value: ((pos?.filter(po => po.status === 'open').length || 0) + (openpos?.length || 0)).toLocaleString(), change: '+5.7%', trend: 'down', icon: <TrendingDown className="h-5 w-5" /> },
    { id: 5, title: 'PO Billing Value', value: formatCurrency(SumOfPOBillingValue()), change: '+15.3%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 6, title: 'Closed PO Value', value: formatCurrency(SumOfClosedPOBillingValue()), change: '+9.8%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 7, title: 'GRN Billing Values', value: formatCurrency(SumOfGrnBillValue()), change: '+7.1%', trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 8, title: 'Open PO Value', value: formatCurrency(SumOfOpenPOBillingValue()), change: '-3.2%', trend: 'down', icon: <TrendingDown className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold">Case Analytics</h1>
        <p className="text-muted-foreground">Track and analyze PO cases and their status</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={kpi.id} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div key={`kpi-${kpi.id}-${index}`} className={`h-6 w-6 rounded-full p-1 ${
                kpi.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>PO Cases Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="cases" stroke="#8b5cf6" fill="#c4b5fd" name="Total Cases" fillOpacity={0.8} />
                      <Area type="monotone" dataKey="closed" stroke="#10b981" fill="#a7f3d0" name="Closed" fillOpacity={0.8} />
                      <Area type="monotone" dataKey="grn" stroke="#8b5cf6" fill="#ddd6fe" name="GRN" fillOpacity={0.8} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Case Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={realTimeData?.caseDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, index = 0 }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = 25 + Number(innerRadius) + (Number(outerRadius) - Number(innerRadius));
                          const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
                          const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);
                          
                          return (
                            <text
                              x={x}
                              y={y}
                              fill={realTimeData?.caseDistribution[index]?.color}
                              textAnchor={x > Number(cx) ? 'start' : 'end'}
                              dominantBaseline="central"
                            >
                              {`${realTimeData?.caseDistribution[index]?.name || ''} ${realTimeData?.caseDistribution[index]?.value || 0}`}
                            </text>
                          );
                        }}
                      >
                        {(realTimeData?.caseDistribution || []).map((entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Billing Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={realTimeData?.billingData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
                      <Legend />
                      <Bar dataKey="value" fill="#8b5cf6" name="Value (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-auto">
                  <div className="grid gap-4">
                    {(realTimeData?.vendorPerformance || []).map((vendor, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                        <div className="font-medium">{vendor.vendor}</div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-muted-foreground">
                            {vendor.closed}/{vendor.totalCases} closed
                          </div>
                          <div className="text-sm font-medium">
                            {formatCurrency(vendor.billing)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Case Details</CardTitle>
        </CardHeader>
        
      </Card>
    </div>
  );
};

export default CaseAnalytics;
