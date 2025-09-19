import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatContext } from '../types/chat';
import * as calculations from '../lib/calculation';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class GeminiService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateResponse(userMessage: string, context: ChatContext): Promise<string> {
    try {
      // Analyze the query and get relevant data
      const analysisData = this.analyzeQuery(userMessage);
      
      // Create a comprehensive context for the AI
      const systemPrompt = this.createSystemPrompt(context);
      
      const prompt = `${systemPrompt}

User Question: ${userMessage}

${analysisData.summary}

Please provide a helpful response based on the available data and calculations. Format numbers with proper currency (₹) and use Indian number formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  }

  private analyzeQuery(query: string): { summary: string; data?: any } {
    const lowerQuery = query.toLowerCase();
    
    // Vendor-related queries
    if (lowerQuery.includes('top') && (lowerQuery.includes('vendor') || lowerQuery.includes('supplier'))) {
      if (lowerQuery.includes('fill rate') || lowerQuery.includes('performance')) {
        const topVendorsByFillRate = calculations.getTopVendorsByFillRate(5);
        return {
          summary: `Top 5 Vendors by Fill Rate:\n${topVendorsByFillRate.map((v, i) => 
            `${i + 1}. ${v.vendor}: ${v.fillRate}% (₹${v.totalPOValue.toLocaleString('en-IN')})`
          ).join('\n')}`,
          data: topVendorsByFillRate
        };
      } else if (lowerQuery.includes('order') || lowerQuery.includes('count')) {
        const topVendorsByOrders = calculations.getTopVendorsByOrderCount(5);
        return {
          summary: `Top 5 Vendors by Order Count:\n${topVendorsByOrders.map((v, i) => 
            `${i + 1}. ${v.vendor}: ${v.orderCount} orders (₹${v.totalPOValue.toLocaleString('en-IN')})`
          ).join('\n')}`,
          data: topVendorsByOrders
        };
      } else {
        const topVendorsByValue = calculations.getTopVendorsByValue(5);
        return {
          summary: `Top 5 Vendors by PO Value:\n${topVendorsByValue.map((v, i) => 
            `${i + 1}. ${v.vendor}: ₹${v.totalPOValue.toLocaleString('en-IN')} (${v.orderCount} orders, ${v.fillRate}% fill rate)`
          ).join('\n')}`,
          data: topVendorsByValue
        };
      }
    }
    
    // Vendor performance summary
    if (lowerQuery.includes('vendor performance') || lowerQuery.includes('vendor summary')) {
      const summary = calculations.getVendorPerformanceSummary();
      return {
        summary: `## Vendor Performance Summary

### Key Metrics
- **Total Vendors:** ${summary.totalVendors}
- **Total Value:** ₹${summary.totalValue.toLocaleString('en-IN')}
- **Average Fill Rate:** ${summary.avgFillRate}%
- **Top Vendor:** ${summary.topVendor}
- **Best Fill Rate:** ${summary.bestFillRate}%

### Analysis
Your vendor network consists of ${summary.totalVendors} active vendors with a total business value of ₹${summary.totalValue.toLocaleString('en-IN')}. The average fill rate of ${summary.avgFillRate}% indicates good supply chain performance. ${summary.topVendor} is your top-performing vendor by value.`,
        data: summary
      };
    }
    
    // Underperforming vendors
    if (lowerQuery.includes('underperforming') || lowerQuery.includes('poor performance')) {
      const underperforming = calculations.getUnderperformingVendors(5);
      return {
        summary: `Underperforming Vendors (Fill Rate < 80%):\n${underperforming.map((v, i) => 
          `${i + 1}. ${v.vendor}: ${v.fillRate}% fill rate (₹${v.totalPOValue.toLocaleString('en-IN')})`
        ).join('\n')}`,
        data: underperforming
      };
    }
    
    // General metrics
    if (lowerQuery.includes('total value') || lowerQuery.includes('revenue')) {
      const totalBilling = calculations.SumOfBilling();
      const openValue = calculations.OpenValuesDatas();
      return {
        summary: `Financial Summary:\n- Total Completed PO Value: ₹${totalBilling.toLocaleString('en-IN')}\n- Open PO Value: ₹${openValue.amt.toLocaleString('en-IN')}`,
        data: { totalBilling, openValue }
      };
    }
    
    // Fill rate metrics
    if (lowerQuery.includes('fill rate')) {
      const fillRate = calculations.FillRate();
      const lineFillRate = calculations.LineFillRate();
      const unitFillRate = calculations.UnitReceiptFillRate();
      return {
        summary: `Fill Rate Metrics:\n- Overall Fill Rate: ${fillRate}%\n- Line Fill Rate: ${lineFillRate}%\n- Unit Receipt Fill Rate: ${unitFillRate}%`,
        data: { fillRate, lineFillRate, unitFillRate }
      };
    }
    
    // Product performance queries
    if (lowerQuery.includes('best performing') && (lowerQuery.includes('product') || lowerQuery.includes('item'))) {
      if (lowerQuery.includes('landing rate') || lowerQuery.includes('profitability')) {
        const topProductsByLandingRate = calculations.getBestPerformingProductsByLandingRate(5);
        return {
          summary: `Top 5 Best Performing Products by Landing Rate:\n${topProductsByLandingRate.map((p, i) => 
            `${i + 1}. ${p.productName}: ₹${p.landingRate.toFixed(2)} landing rate (₹${p.totalPoValue.toLocaleString('en-IN')} total value)`
          ).join('\n')}`,
          data: topProductsByLandingRate
        };
      } else if (lowerQuery.includes('value') || lowerQuery.includes('revenue')) {
        const topProductsByValue = calculations.getBestPerformingProductsByValue(5);
        return {
          summary: `Top 5 Best Performing Products by Total Value:\n${topProductsByValue.map((p, i) => 
            `${i + 1}. ${p.productName}: ₹${p.totalPoValue.toLocaleString('en-IN')} (${p.orderCount} orders, ₹${p.landingRate.toFixed(2)} landing rate)`
          ).join('\n')}`,
          data: topProductsByValue
        };
      } else if (lowerQuery.includes('order') || lowerQuery.includes('popular')) {
        const topProductsByOrders = calculations.getBestPerformingProductsByOrderCount(5);
        return {
          summary: `Top 5 Most Popular Products by Order Count:\n${topProductsByOrders.map((p, i) => 
            `${i + 1}. ${p.productName}: ${p.orderCount} orders (₹${p.totalPoValue.toLocaleString('en-IN')}, ₹${p.landingRate.toFixed(2)} landing rate)`
          ).join('\n')}`,
          data: topProductsByOrders
        };
      } else {
        // Default to landing rate for "best performing products"
        const topProductsByLandingRate = calculations.getBestPerformingProductsByLandingRate(5);
        return {
          summary: `## Top 5 Best Performing Products (by Landing Rate)

${topProductsByLandingRate.map((p, i) => 
  `### ${i + 1}. ${p.productName}
- **Landing Rate:** ₹${p.landingRate.toFixed(2)}
- **Total Value:** ₹${p.totalPoValue.toLocaleString('en-IN')}
- **Orders:** ${p.orderCount}
- **Category:** ${p.category}
- **MRP:** ₹${p.mrp.toLocaleString('en-IN')}`
).join('\n\n')}`,
          data: topProductsByLandingRate
        };
      }
    }
    
    // Product performance summary
    if (lowerQuery.includes('product performance') || lowerQuery.includes('product summary')) {
      const summary = calculations.getProductPerformanceSummary();
      return {
        summary: `## Product Performance Summary

### Key Metrics
- **Total Products:** ${summary.totalProducts}
- **Total Value:** ₹${summary.totalValue.toLocaleString('en-IN')}
- **Average Landing Rate:** ₹${summary.avgLandingRate.toFixed(2)}
- **Top Product:** ${summary.topProduct}
- **Highest Landing Rate:** ₹${summary.highestLandingRate.toFixed(2)}
- **Total Orders:** ${summary.totalOrders}

### Analysis
Based on the available data from ${summary.totalProducts} unique products, your product portfolio shows strong performance with an average landing rate of ₹${summary.avgLandingRate.toFixed(2)}. The top-performing product "${summary.topProduct}" has the highest landing rate of ₹${summary.highestLandingRate.toFixed(2)}.`,
        data: summary
      };
    }
    
    // Products by category
    if (lowerQuery.includes('products') && (lowerQuery.includes('category') || lowerQuery.includes('type'))) {
      // Extract category from query
      const categoryMatch = lowerQuery.match(/(?:in|of|for)\s+(\w+)/);
      if (categoryMatch) {
        const category = categoryMatch[1];
        const productsByCategory = calculations.getProductsByCategory(category, 5);
        return {
          summary: `Top Products in ${category.toUpperCase()} Category:\n${productsByCategory.map((p, i) => 
            `${i + 1}. ${p.productName}: ₹${p.landingRate.toFixed(2)} landing rate (₹${p.totalPoValue.toLocaleString('en-IN')})`
          ).join('\n')}`,
          data: productsByCategory
        };
      }
    }
    
    return { summary: '' };
  }

  private createSystemPrompt(context: ChatContext): string {
    const { openPos, pos, landingRates, universalPO } = context;
    
    return `You are an AI assistant for an ERP (Enterprise Resource Planning) system. You help users analyze and understand their business data including Purchase Orders, Landing Rates, and other business metrics.

Available Data Context:
- Open Purchase Orders: ${openPos.length} records
- Completed Purchase Orders: ${pos.length} records  
- Landing Rates: ${landingRates.length} records
- Universal PO Data: ${universalPO.length} records

Data Structure:
Purchase Orders contain:
- PO Number, Vendor, Ordered/Received Quantities, PO Amount
- SKU Code, SKU Description, Status, etc.

Landing Rates contain:
- SKU ID, Product Name, MRP, Category, Cases, Merchants, Landing Rate

Your Role:
1. Analyze the user's question and provide insights based on the available data
2. If asked for specific metrics, calculate and present them clearly
3. Identify trends, patterns, or anomalies in the data
4. Provide actionable business insights
5. If data is insufficient, suggest what additional information might be helpful
6. Always format numbers with proper currency (₹) and use Indian number formatting
7. Be concise but comprehensive in your responses
8. Use the pre-calculated data when available to provide accurate insights
9. Format responses using Markdown for better readability:
   - Use ## for main headings
   - Use ### for subheadings
   - Use **bold** for important metrics
   - Use bullet points (-) for lists
   - Use proper line breaks for readability
10. Structure responses with clear sections and proper spacing

Example capabilities:
- "Show me the top 5 vendors by PO value"
- "What's the average fill rate for open POs?"
- "Which products have the highest landing rates?"
- "How many POs are pending vs completed?"
- "What's the total value of open purchase orders?"
- "Show me underperforming vendors"
- "What's the vendor performance summary?"
- "What are the best performing products?"
- "Show me products with highest landing rates"
- "Which products have the most orders?"
- "What's the product performance summary?"
- "Show me products in electronics category"`;
  }

  async analyzeData(query: string, context: ChatContext): Promise<{
    summary: string;
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const response = await this.generateResponse(query, context);
      
      // Parse the response to extract structured insights
      return {
        summary: response,
        insights: this.extractInsights(response),
        recommendations: this.extractRecommendations(response)
      };
    } catch (error) {
      console.error('Error analyzing data:', error);
      return {
        summary: "Unable to analyze the data at this time.",
        insights: [],
        recommendations: []
      };
    }
  }

  private extractInsights(response: string): string[] {
    // Simple extraction logic - in a real app, you might use more sophisticated parsing
    const insightMarkers = ['insight:', 'key finding:', 'trend:', 'pattern:'];
    return insightMarkers
      .map(marker => {
        const regex = new RegExp(`${marker}\\s*([^\\n]+)`, 'gi');
        const matches = response.match(regex);
        return matches ? matches.map(match => match.replace(new RegExp(marker, 'gi'), '').trim()) : [];
      })
      .flat()
      .filter(Boolean);
  }

  private extractRecommendations(response: string): string[] {
    const recMarkers = ['recommend:', 'suggest:', 'consider:', 'action:'];
    return recMarkers
      .map(marker => {
        const regex = new RegExp(`${marker}\\s*([^\\n]+)`, 'gi');
        const matches = response.match(regex);
        return matches ? matches.map(match => match.replace(new RegExp(marker, 'gi'), '').trim()) : [];
      })
      .flat()
      .filter(Boolean);
  }
}

export const geminiService = new GeminiService();
