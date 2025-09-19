import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  IconSend, 
  IconRobot, 
  IconUser, 
  IconTrendingUp,
  IconAlertCircle,
  IconRefresh,
  IconCopy,
  IconCheck
} from '@tabler/icons-react';
import { useDataStore } from '@/store/useDataStore';
import { geminiService } from '@/services/gemini';
import type { ChatMessage } from '@/types/chat';
import { FormattedMessage } from '@/components/ui/formatted-message';

const SmartChat = () => {
  const { openpos, pos, landingRates, universalPO } = useDataStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = {
        openPos: openpos,
        pos: pos,
        landingRates: landingRates,
        universalPO: universalPO
      };

      const response = await geminiService.generateResponse(inputValue.trim(), context);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };


  const suggestedQueries = [
    "What are the best performing products?",
    "Show me the top 5 vendors by PO value",
    "What's the product performance summary?",
    "Show me products with highest landing rates",
    "What's the vendor performance summary?",
    "Which products have the most orders?",
    "Show me underperforming vendors",
    "What's the total value of open purchase orders?"
  ];

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col max-w-full h-screen">

      {/* Chat Interface */}
      <Card className="flex flex-col flex-1 rounded-none border-0 shadow-none dark:bg-black">
        <CardContent className="flex flex-col flex-1 p-0">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col flex-1 justify-center items-center p-8 text-center">
              <div className="flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <IconRobot className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="mb-2 text-3xl font-bold">Welcome back, Alex! 👋</h2>
              <p className="mb-8 max-w-md text-lg text-muted-foreground">
                I'm your ERP AI assistant, ready to help you analyze your business data and make informed decisions.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8 max-w-2xl md:grid-cols-2">
                <Card className="p-4 text-left">
                  <div className="flex items-center mb-2 space-x-2">
                    <IconAlertCircle className="w-4 h-4 text-orange-500" />
                    <p className="text-sm font-medium">Open POs</p>
                  </div>
                  <p className="text-2xl font-bold">{openpos.length}</p>
                </Card>
                <Card className="p-4 text-left">
                  <div className="flex items-center mb-2 space-x-2">
                    <IconCheck className="w-4 h-4 text-green-500" />
                    <p className="text-sm font-medium">Completed POs</p>
                  </div>
                  <p className="text-2xl font-bold">{pos.length}</p>
                </Card>
                <Card className="p-4 text-left">
                  <div className="flex items-center mb-2 space-x-2">
                    <IconTrendingUp className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-medium">Landing Rates</p>
                  </div>
                  <p className="text-2xl font-bold">{landingRates.length}</p>
                </Card>
                <Card className="p-4 text-left">
                  <div className="flex items-center mb-2 space-x-2">
                    <IconRobot className="w-4 h-4 text-purple-500" />
                    <p className="text-sm font-medium">Universal POs</p>
                  </div>
                  <p className="text-2xl font-bold">{universalPO.length}</p>
                </Card>
              </div>

              <div className="w-full max-w-2xl">
                <p className="mb-4 text-sm text-muted-foreground">Try asking me:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQueries.slice(0, 4).map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="px-3 py-2 h-auto text-xs"
                      onClick={() => handleSuggestedQuery(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages Area */
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] space-x-2 ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-blue-500'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <IconUser className="w-4 h-4 text-white" />
                        ) : (
                          <IconRobot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <FormattedMessage content={message.content} />
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                        )}
                        
                        {/* Message Actions */}
                        <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                          <span>
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 w-6 h-6 opacity-70 hover:opacity-100"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copiedMessageId === message.id ? (
                                <IconCheck className="w-3 h-3" />
                              ) : (
                                <IconCopy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2">
                      <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                        <IconRobot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex items-center px-4 py-2 space-x-1 rounded-2xl bg-muted">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground"></div>
                          <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 rounded-full animate-bounce bg-muted-foreground" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Input Area - Always at bottom */}
          <div className="p-4 border-t bg-background">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your ERP data..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <IconRefresh className="w-4 h-4 animate-spin" />
                ) : (
                  <IconSend className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartChat;