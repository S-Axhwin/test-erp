import { useState } from "react";
import { useDataStore } from "@/store/useDataStore";

const TestUpload = () => {
  const { pos, openpos, addPO, addOpenPO } = useDataStore();
  const [testData, setTestData] = useState({
    poNumber: "TEST-001",
    vendor: "Test Vendor",
    orderedQty: 100,
    receivedQty: 95,
    poAmount: 1500.00,
    status: "completed" as const
  });

  const handleAddPO = () => {
    addPO({
      ...testData,
      skuCode: "TEST-SKU-001",
      skuDescription: "Test Product Description",
      poLineValueWithTax: testData.poAmount * 1.1
    });
  };

  const handleAddOpenPO = () => {
    addOpenPO({
      ...testData,
      skuCode: "TEST-SKU-002", 
      skuDescription: "Test Open Product Description",
      poLineValueWithTax: testData.poAmount * 1.1
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Test Upload Component</h1>
      
      <div className="space-y-2">
        <input 
          type="text" 
          placeholder="PO Number" 
          value={testData.poNumber}
          onChange={(e) => setTestData({...testData, poNumber: e.target.value})}
          className="border p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Vendor" 
          value={testData.vendor}
          onChange={(e) => setTestData({...testData, vendor: e.target.value})}
          className="border p-2 rounded"
        />
        <input 
          type="number" 
          placeholder="Ordered Qty" 
          value={testData.orderedQty}
          onChange={(e) => setTestData({...testData, orderedQty: parseInt(e.target.value) || 0})}
          className="border p-2 rounded"
        />
        <input 
          type="number" 
          placeholder="Received Qty" 
          value={testData.receivedQty}
          onChange={(e) => setTestData({...testData, receivedQty: parseInt(e.target.value) || 0})}
          className="border p-2 rounded"
        />
        <input 
          type="number" 
          placeholder="PO Amount" 
          value={testData.poAmount}
          onChange={(e) => setTestData({...testData, poAmount: parseFloat(e.target.value) || 0})}
          className="border p-2 rounded"
        />
        <select 
          value={testData.status}
          onChange={(e) => setTestData({...testData, status: e.target.value as "completed" | "cancelled" | "confirmed" | "expired"})}
          className="border p-2 rounded"
        >
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="confirmed">Confirmed</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleAddPO}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add PO
        </button>
        <button 
          onClick={handleAddOpenPO}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Open PO
        </button>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Current Data</h2>
        <p>Regular POs: {pos.length}</p>
        <p>Open POs: {openpos.length}</p>
      </div>
    </div>
  );
};

export default TestUpload;