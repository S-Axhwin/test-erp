// Import the store type for TypeScript
import { useDataStore, type PO } from '@/store/useDataStore';
// Create a function to get the store without hooks
const getDataStore = () => {
  // This is a workaround to use the store outside of React components
  if (typeof window !== 'undefined' && window.__DATA_STORE__) {
    return window.__DATA_STORE__.getState();
  }
  return { pos: [], openpos: [] };
};

// Helper function to safely access PO properties
const getPoAmount = (po: PO): number => typeof po.poAmount === 'number' ? po.poAmount : 0;
const getOrderedQty = (po: PO): number => typeof po.orderedQty === 'number' ? po.orderedQty : 0;
const getReceivedQty = (po: PO): number => typeof po.receivedQty === 'number' ? po.receivedQty : 0;

export const SumOfBilling = (): number => {
  const { pos } = getDataStore();
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  return pos.reduce((acc: number, cur: PO) => acc + getPoAmount(cur), 0);
};

// Fill Rate = (Received Qty * 100) / Ordered Qty
export const FillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const completedPos = pos.filter((po: PO) => po.status=="completed");

  const totalOrdered = completedPos.reduce((acc: number, cur: PO) => acc + getOrderedQty(cur), 0);
  const totalReceived = completedPos.reduce((acc: number, cur: PO) => acc + getReceivedQty(cur), 0);
  
  if (totalOrdered === 0) return 0;
  
  const fillRate = (totalReceived * 100) / totalOrdered;
  return parseFloat(fillRate.toFixed(2));
};

// LFR (Line Fill Rate) =status completeds orderqty==receivedqty then len of this / len of completed avg
export const LineFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  const completedPos = pos.filter((po: PO) => po.status=="completed");
  const perfectLines = completedPos.filter((po: PO) => getOrderedQty(po) === getReceivedQty(po)).length;
  const lineFillRate = (perfectLines * 100) / completedPos.length;
  return parseFloat(lineFillRate.toFixed(2));
};

// URF (Unit Receipt Fill Rate) = status == completed => (Received Qty * 100) / Ordered Qty
export const UnitReceiptFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;
  
  const updated = pos.filter((po) => {
    // console.log(po.status == "completed");
    return po.status=="completed"
  })

  console.log(updated.length);
   
  const totalOrdered = updated.reduce((acc: number, cur: PO) => acc + getOrderedQty(cur), 0);
  const totalReceived = updated.reduce((acc: number, cur: PO) => acc + getReceivedQty(cur), 0);
  
  if (totalOrdered === 0) return 0;
  // console.log(totalOrdered, totalReceived);
  
  const urf = (totalReceived * 100) / totalOrdered;
  return parseFloat(urf.toFixed(2));
};

// NZFR (Non-Zero Fill Rate) = Percentage of lines with at least one item received
export const NonZeroFillRate = (): number => {
  const { pos } = getDataStore();
  
  if (!pos || !Array.isArray(pos) || pos.length === 0) return 0;

  const updated = pos.filter((po) => {
    return po.status=="completed"
  })

  const nonZeroLines = updated.filter((po: PO) => getReceivedQty(po) > 0).length;
  console.log(nonZeroLines);
  const nzfr = (nonZeroLines * 100) / updated.length;
  return parseFloat(nzfr.toFixed(2));
};

export const TotalOrders = (): number => {
  const { pos } = getDataStore();
  return Array.isArray(pos) ? pos.length : 0;
};

// Export a function to get all metrics at once for better performance
export const getAllMetrics = () => ({
  revenue: SumOfBilling(),
  fillRate: FillRate(),
  lineFillRate: LineFillRate(),
  nzfr: NonZeroFillRate(),
  totalOrders: TotalOrders(),
  unitReceiptFillRate: UnitReceiptFillRate()
});

export const Mapping = () => {
  const {pos, landingRates } = useDataStore();
  if(!pos || pos.length === 0) return [];
  
  // Create a map for quick lookup of landing rates by skuid
  const landingRateMap = new Map(landingRates.map(rate => [rate.skuId, rate]));
  
  // Map pos items to their corresponding landing rates using skucode -> skuid mapping
  const mappedData = pos.map(po => {
    const landingRateData = landingRateMap.get(po.skuCode);
    return {
      poNumber: po.poNumber,
      vendor: po.vendor,
      orderedQty: po.orderedQty,
      receivedQty: po.receivedQty,
      poAmount: po.poAmount,
      skuCode: landingRateData?.skuId || po.skuCode, // Fallback to original skuCode
      units: ((landingRateData?.cases || 1)),
      cases: (po.orderedQty / (landingRateData?.cases || 1)),
      grncase: (po.receivedQty / (landingRateData?.cases || 1)),
      mrp: landingRateData?.mrp || 0,
      landingRate: landingRateData?.landingRate || 0,
      skuDescription: po.skuDescription,
      poLineValueWithTax: po.poLineValueWithTax,
      grnBillValue: po.receivedQty * (landingRateData?.landingRate || 0),
      status: po.status
    };
  });
  
  return mappedData;
};

// Hook for updating universal PO - must be used in React components
export const useUpdateUniversalPO = () => {
  const { setUniversalPo } = useDataStore();
  
  const updateUniversalPO = () => {
    const mappedData = Mapping();
    if (mappedData) {
      setUniversalPo(mappedData);
    }
    return mappedData || [];
  };
  
  return updateUniversalPO;
};

// sum of PO billvalue = status !expired  | sum of poLineValueWithTax
// sum of PO case = status !expired | sum of orderQty cases

// status completed sum of polinewithtax = sum of closedPO billvalue
// status completed | cases = sum of closedPO cases

// --grn-- -> reviced qty > 0 && status completed
// sum of grn bill value => 
// sum of grn cases


// cosolidation //

// Sum of PO billing value for status: completed, confirmed, expired
export const SumOfPOBillingValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  const allowedStatuses = ['completed', 'confirmed', 'expired'];
  return mappedData
    .filter(po => allowedStatuses.includes(po.status?.toLowerCase() || ''))
    .reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of PO cases for status: completed, confirmed, expired
export const SumOfPOCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  const allowedStatuses = ['completed', 'confirmed', 'expired'];
  return mappedData
    .filter(po => allowedStatuses.includes(po.status?.toLowerCase() || ''))
    .reduce((acc: number, cur) => acc + (cur.cases || 0), 0);
};

// Sum of closed PO billing value for status: completed (from poLineValueWithTax)
export const SumOfClosedPOBillingValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of closed PO cases for status: completed (ordered quantity converted to cases)
export const SumOfClosedPOCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  // Get unique mapped data by poNumber
  const uniqueMappedData = mappedData.filter((po, index, arr) => 
    arr.findIndex(item => item.poNumber === po.poNumber) === index
  );
  
  return uniqueMappedData
    .filter(po => po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.cases || 0), 0);
};

// Sum of open PO billing value from openpos data (from poLineValueWithTax)
export const SumOfOpenPOBillingValue = (): number => {
  const { openpos } = getDataStore();
  if (!openpos || !Array.isArray(openpos) || openpos.length === 0) return 0;
  
  return openpos.reduce((acc: number, cur) => acc + (cur.poLineValueWithTax || 0), 0);
};

// Sum of GRN bill value for items with receivedQty > 0 and status: completed
export const SumOfGrnBillValue = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.receivedQty > 0 && po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.grnBillValue || 0), 0);
};
export const SumOfGrnCases = (): number => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .filter(po => po.receivedQty > 0 && po.status?.toLowerCase() === 'completed')
    .reduce((acc: number, cur) => acc + (cur.grncase || 0), 0);
}
export const POBillingValue = () => {
  return 0
}


export const OpenValuesDatas = () => {
  const {openpos} = useDataStore();
  // console.log("open po values", openpos.reduce((acc, cur) => acc + (cur.poLineValueWithTax || 0), 0));
  
  return {amt: openpos.reduce((acc, cur) => acc + (cur.poLineValueWithTax || 0), 0)}
}

export const GetNoOfCases = () => {
  const mappedData = Mapping();
  if (!mappedData || !Array.isArray(mappedData) || mappedData.length === 0) return 0;
  
  return mappedData
    .reduce((acc: number, cur) => acc + (cur.cases || 0), 0);
}

// Vendor Analysis Functions
export interface VendorMetrics {
  vendor: string;
  totalPOValue: number;
  totalOrderedQty: number;
  totalReceivedQty: number;
  fillRate: number;
  orderCount: number;
  avgOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
}

// Get top performing vendors by PO value
export const getTopVendorsByValue = (limit: number = 10): VendorMetrics[] => {
  const { pos, openpos } = getDataStore();
  const allPos = [...pos, ...openpos];
  
  if (!allPos || allPos.length === 0) return [];
  
  // Check cache first
  const now = Date.now();
  if (vendorMetricsCache && (now - vendorMetricsCache.timestamp) < CACHE_DURATION) {
    return vendorMetricsCache.data.slice(0, limit);
  }
  
  const vendorMap = new Map<string, VendorMetrics>();
  
  allPos.forEach(po => {
    const vendor = po.vendor;
    if (!vendor) return;
    
    const existing = vendorMap.get(vendor) || {
      vendor,
      totalPOValue: 0,
      totalOrderedQty: 0,
      totalReceivedQty: 0,
      fillRate: 0,
      orderCount: 0,
      avgOrderValue: 0,
      completedOrders: 0,
      pendingOrders: 0
    };
    
    existing.totalPOValue += getPoAmount(po);
    existing.totalOrderedQty += getOrderedQty(po);
    existing.totalReceivedQty += getReceivedQty(po);
    existing.orderCount += 1;
    
    if (po.status === 'completed') {
      existing.completedOrders += 1;
    } else {
      existing.pendingOrders += 1;
    }
    
    vendorMap.set(vendor, existing);
  });
  
  // Calculate derived metrics
  const vendors = Array.from(vendorMap.values()).map(vendor => {
    vendor.fillRate = vendor.totalOrderedQty > 0 
      ? parseFloat(((vendor.totalReceivedQty * 100) / vendor.totalOrderedQty).toFixed(2))
      : 0;
    vendor.avgOrderValue = vendor.orderCount > 0 
      ? parseFloat((vendor.totalPOValue / vendor.orderCount).toFixed(2))
      : 0;
    return vendor;
  });
  
  // Sort by total PO value
  const sortedVendors = vendors.sort((a, b) => b.totalPOValue - a.totalPOValue);
  
  // Update cache
  vendorMetricsCache = {
    data: sortedVendors,
    timestamp: now
  };
  
  return sortedVendors.slice(0, limit);
};

// Get top vendors by fill rate
export const getTopVendorsByFillRate = (limit: number = 10): VendorMetrics[] => {
  const vendors = getTopVendorsByValue(50); // Get more vendors first
  return vendors
    .filter(vendor => vendor.fillRate > 0) // Only vendors with completed orders
    .sort((a, b) => b.fillRate - a.fillRate)
    .slice(0, limit);
};

// Get vendors with most orders
export const getTopVendorsByOrderCount = (limit: number = 10): VendorMetrics[] => {
  const vendors = getTopVendorsByValue(50);
  return vendors
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, limit);
};

// Get vendor performance summary
export const getVendorPerformanceSummary = () => {
  const vendors = getTopVendorsByValue(100);
  
  if (vendors.length === 0) {
    return {
      totalVendors: 0,
      totalValue: 0,
      avgFillRate: 0,
      topVendor: null,
      bestFillRate: 0
    };
  }
  
  const totalValue = vendors.reduce((sum, vendor) => sum + vendor.totalPOValue, 0);
  const avgFillRate = vendors.reduce((sum, vendor) => sum + vendor.fillRate, 0) / vendors.length;
  const topVendor = vendors[0];
  const bestFillRateVendor = vendors.sort((a, b) => b.fillRate - a.fillRate)[0];
  
  return {
    totalVendors: vendors.length,
    totalValue: parseFloat(totalValue.toFixed(2)),
    avgFillRate: parseFloat(avgFillRate.toFixed(2)),
    topVendor: topVendor?.vendor || 'N/A',
    bestFillRate: parseFloat(bestFillRateVendor?.fillRate.toFixed(2) || '0')
  };
};

// Get vendor details by name
export const getVendorDetails = (vendorName: string): VendorMetrics | null => {
  const vendors = getTopVendorsByValue(1000);
  return vendors.find(vendor => 
    vendor.vendor.toLowerCase().includes(vendorName.toLowerCase())
  ) || null;
};

// Get underperforming vendors (low fill rate)
export const getUnderperformingVendors = (limit: number = 10): VendorMetrics[] => {
  const vendors = getTopVendorsByValue(100);
  return vendors
    .filter(vendor => vendor.fillRate > 0 && vendor.fillRate < 80) // Less than 80% fill rate
    .sort((a, b) => a.fillRate - b.fillRate)
    .slice(0, limit);
};

// Product Performance Analysis Functions
export interface ProductMetrics {
  skuId: string;
  productName: string;
  category: string;
  landingRate: number;
  mrp: number;
  totalOrderedQty: number;
  totalReceivedQty: number;
  totalPoValue: number;
  orderCount: number;
  avgOrderValue: number;
  fillRate: number;
  merchants: number;
  cases: number;
}

// Cache for product metrics to prevent unnecessary recalculations
let productMetricsCache: { data: ProductMetrics[], timestamp: number } | null = null;
let vendorMetricsCache: { data: VendorMetrics[], timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds cache

// Function to clear all caches when data changes
export const clearCalculationCaches = () => {
  productMetricsCache = null;
  vendorMetricsCache = null;
};

// Get best performing products by landing rate
export const getBestPerformingProductsByLandingRate = (limit: number = 10): ProductMetrics[] => {
  const { landingRates } = getDataStore();
  const { pos, openpos } = getDataStore();
  const allPos = [...pos, ...openpos];
  
  if (!landingRates || landingRates.length === 0) return [];
  
  // Check cache first
  const now = Date.now();
  if (productMetricsCache && (now - productMetricsCache.timestamp) < CACHE_DURATION) {
    return productMetricsCache.data.slice(0, limit);
  }
  
  // Create a map for quick lookup of PO data by SKU
  const poMap = new Map<string, any[]>();
  allPos.forEach(po => {
    const skuCode = po.skuCode;
    if (!poMap.has(skuCode)) {
      poMap.set(skuCode, []);
    }
    poMap.get(skuCode)!.push(po);
  });
  
  // Combine landing rates with PO data
  const productMetrics: ProductMetrics[] = landingRates.map(rate => {
    const poData = poMap.get(rate.skuId) || [];
    
    const totalOrderedQty = poData.reduce((sum, po) => sum + getOrderedQty(po), 0);
    const totalReceivedQty = poData.reduce((sum, po) => sum + getReceivedQty(po), 0);
    const totalPoValue = poData.reduce((sum, po) => sum + getPoAmount(po), 0);
    const orderCount = poData.length;
    const avgOrderValue = orderCount > 0 ? totalPoValue / orderCount : 0;
    const fillRate = totalOrderedQty > 0 ? (totalReceivedQty * 100) / totalOrderedQty : 0;
    
    return {
      skuId: rate.skuId,
      productName: rate.productName,
      category: rate.category,
      landingRate: rate.landingRate,
      mrp: rate.mrp,
      totalOrderedQty,
      totalReceivedQty,
      totalPoValue,
      orderCount,
      avgOrderValue,
      fillRate,
      merchants: rate.merchants,
      cases: rate.cases
    };
  });
  
  // Sort by landing rate
  const sortedProducts = productMetrics.sort((a, b) => b.landingRate - a.landingRate);
  
  // Update cache
  productMetricsCache = {
    data: sortedProducts,
    timestamp: now
  };
  
  return sortedProducts.slice(0, limit);
};

// Get best performing products by total PO value
export const getBestPerformingProductsByValue = (limit: number = 10): ProductMetrics[] => {
  const products = getBestPerformingProductsByLandingRate(100); // Get more products first
  return products
    .filter(product => product.totalPoValue > 0)
    .sort((a, b) => b.totalPoValue - a.totalPoValue)
    .slice(0, limit);
};

// Get best performing products by order count
export const getBestPerformingProductsByOrderCount = (limit: number = 10): ProductMetrics[] => {
  const products = getBestPerformingProductsByLandingRate(100);
  return products
    .filter(product => product.orderCount > 0)
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, limit);
};

// Get best performing products by fill rate
export const getBestPerformingProductsByFillRate = (limit: number = 10): ProductMetrics[] => {
  const products = getBestPerformingProductsByLandingRate(100);
  return products
    .filter(product => product.fillRate > 0)
    .sort((a, b) => b.fillRate - a.fillRate)
    .slice(0, limit);
};

// Get product performance summary
export const getProductPerformanceSummary = () => {
  const products = getBestPerformingProductsByLandingRate(100);
  
  if (products.length === 0) {
    return {
      totalProducts: 0,
      totalValue: 0,
      avgLandingRate: 0,
      topProduct: null,
      highestLandingRate: 0,
      totalOrders: 0
    };
  }
  
  const totalValue = products.reduce((sum, product) => sum + product.totalPoValue, 0);
  const avgLandingRate = products.reduce((sum, product) => sum + product.landingRate, 0) / products.length;
  const totalOrders = products.reduce((sum, product) => sum + product.orderCount, 0);
  const topProduct = products[0];
  const highestLandingRate = products.reduce((max, product) => Math.max(max, product.landingRate), 0);
  
  return {
    totalProducts: products.length,
    totalValue: parseFloat(totalValue.toFixed(2)),
    avgLandingRate: parseFloat(avgLandingRate.toFixed(2)),
    topProduct: topProduct?.productName || 'N/A',
    highestLandingRate: parseFloat(highestLandingRate.toFixed(2)),
    totalOrders
  };
};

// Get products by category
export const getProductsByCategory = (category: string, limit: number = 10): ProductMetrics[] => {
  const products = getBestPerformingProductsByLandingRate(1000);
  return products
    .filter(product => product.category.toLowerCase().includes(category.toLowerCase()))
    .slice(0, limit);
};

// Get product details by name or SKU
export const getProductDetails = (productIdentifier: string): ProductMetrics | null => {
  const products = getBestPerformingProductsByLandingRate(1000);
  return products.find(product => 
    product.productName.toLowerCase().includes(productIdentifier.toLowerCase()) ||
    product.skuId.toLowerCase().includes(productIdentifier.toLowerCase())
  ) || null;
};