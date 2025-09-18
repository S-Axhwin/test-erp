import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, ExternalLink, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  links?: Array<{
    title: string;
    path: string;
    description: string;
  }>;
}

const ROUTE_MAPPINGS = {
  // Main routes from your App.tsx
  home: { path: '/', title: 'Dashboard', description: 'Main dashboard overview' },
  upload: { path: '/upload', title: 'Upload Data', description: 'Upload CSV/Excel files' },
  pos: { path: '/pos', title: 'Purchase Orders', description: 'View all purchase orders' },
  openPos: { path: '/open-pos', title: 'Open POs', description: 'View open purchase orders' },
  platform: { path: '/platform', title: 'Platform Comparison', description: 'Compare platform performance' },
  aiChatbot: { path: '/ai-chatbot', title: 'AI Chatbot', description: 'AI assistant interface' },
  aiChat: { path: '/ai-chat', title: 'AI Chat', description: 'Direct AI chat' },
  conversation: { path: '/conversation', title: 'Conversation', description: 'AI conversation interface' },
  vendors: { path: '/vendors', title: 'Vendor Analytics', description: 'Vendor performance analytics' },
  aiInsights: { path: '/ai-insights', title: 'AI Insights', description: 'AI-powered business insights' },
  target: { path: '/target', title: 'Target Analysis', description: 'Target performance analysis' },
  profitAnalysis: { path: '/profit-analysis', title: 'Profit Analysis', description: 'Financial profit analysis' },
  notifications: { path: '/notifications', title: 'Notifications', description: 'System notifications' },
  profile: { path: '/profile', title: 'Profile', description: 'User profile settings' },
  caseAnalytics: { path: '/case-analytics', title: 'Case Analytics', description: 'Case-by-case analysis' },
  landingRate: { path: '/landing-rate', title: 'Landing Rate', description: 'Landing rate metrics' }
};

const SMART_RESPONSES = {
  // Purchase Order related queries
  po: {
    keywords: ['po', 'purchase order', 'orders', 'ordering', 'procurement'],
    content: '📋 I can help you with Purchase Orders! Here are the relevant sections:',
    links: [
      ROUTE_MAPPINGS.pos,
      ROUTE_MAPPINGS.openPos,
      ROUTE_MAPPINGS.upload
    ]
  },
  
  // Vendor related queries
  vendor: {
    keywords: ['vendor', 'supplier', 'vendors', 'supplier analytics', 'vendor performance'],
    content: '🏢 Let me show you vendor-related information and analytics:',
    links: [
      ROUTE_MAPPINGS.vendors,
      ROUTE_MAPPINGS.openPos,
      ROUTE_MAPPINGS.profitAnalysis
    ]
  },
  
  // Analytics and insights
  analytics: {
    keywords: ['analytics', 'insights', 'analysis', 'performance', 'metrics', 'data'],
    content: '📊 Here are your analytics and insights options:',
    links: [
      ROUTE_MAPPINGS.aiInsights,
      ROUTE_MAPPINGS.vendors,
      ROUTE_MAPPINGS.caseAnalytics,
      ROUTE_MAPPINGS.profitAnalysis
    ]
  },
  
  // AI related queries
  ai: {
    keywords: ['ai', 'artificial intelligence', 'chatbot', 'assistant', 'smart'],
    content: '🤖 Explore our AI-powered features:',
    links: [
      ROUTE_MAPPINGS.aiInsights,
      ROUTE_MAPPINGS.aiChatbot,
      ROUTE_MAPPINGS.conversation
    ]
  },
  
  // Financial/Profit queries
  financial: {
    keywords: ['profit', 'financial', 'money', 'revenue', 'cost', 'inr', '₹'],
    content: '💰 Financial analysis and profit insights:',
    links: [
      ROUTE_MAPPINGS.profitAnalysis,
      ROUTE_MAPPINGS.vendors,
      ROUTE_MAPPINGS.target
    ]
  },
  
  // Upload and data management
  upload: {
    keywords: ['upload', 'import', 'csv', 'excel', 'file', 'data import'],
    content: '📁 Data upload and management options:',
    links: [
      ROUTE_MAPPINGS.upload,
      ROUTE_MAPPINGS.pos,
      ROUTE_MAPPINGS.vendors
    ]
  },
  
  // Platform and comparison
  platform: {
    keywords: ['platform', 'compare', 'comparison', 'benchmark'],
    content: '⚖️ Platform comparison and benchmarking:',
    links: [
      ROUTE_MAPPINGS.platform,
      ROUTE_MAPPINGS.vendors,
      ROUTE_MAPPINGS.target
    ]
  },
  
  // General dashboard
  dashboard: {
    keywords: ['dashboard', 'overview', 'home', 'main', 'summary'],
    content: '🏠 Dashboard and overview sections:',
    links: [
      ROUTE_MAPPINGS.home,
      ROUTE_MAPPINGS.vendors,
      ROUTE_MAPPINGS.aiInsights
    ]
  }
};

export default function SmartChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      content: '👋 Hi! I\'m your smart assistant. Ask me about any feature and I\'ll provide you with relevant links and information!',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSmartResponse = (userMessage: string): { content: string; links: Array<{ title: string; path: string; description: string }> } => {
    const message = userMessage.toLowerCase();
    
    // Find the best matching category
    for (const [, config] of Object.entries(SMART_RESPONSES)) {
      if (config.keywords.some(keyword => message.includes(keyword))) {
        return {
          content: config.content,
          links: config.links
        };
      }
    }
    
    // Default response with most common links
    return {
      content: '🔍 I can help you navigate to different sections. Here are some popular options:',
      links: [
        ROUTE_MAPPINGS.home,
        ROUTE_MAPPINGS.vendors,
        ROUTE_MAPPINGS.aiInsights,
        ROUTE_MAPPINGS.pos
      ]
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getSmartResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'ai',
        timestamp: new Date(),
        links: response.links
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/ai-chatbot')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Smart Assistant</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-11">
          Ask about any feature and get instant navigation links
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[80%] space-y-3",
                message.sender === 'user' ? "items-end" : "items-start"
              )}>
                <Card className={cn(
                  "p-3",
                  message.sender === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted"
                )}>
                  <p className="text-sm">{message.content}</p>
                </Card>

                {message.links && message.links.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                    {message.links.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="p-3 cursor-pointer hover:bg-muted/80 transition-colors border-l-4 border-l-primary/50 hover:border-l-primary"
                          onClick={() => handleLinkClick(link.path)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate">
                                {link.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {link.description}
                              </p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <Card className="p-3 bg-muted">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </Card>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-muted/20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about vendors, analytics, POs, uploads..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Show me vendors', 'Upload data', 'AI insights', 'Profit analysis'].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(suggestion)}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}