import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI legal assistant. I can help explain clauses, analyze documents, draft contracts, and answer legal questions. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user, demoMode } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (demoMode) {
        // Demo mode responses
        const demoResponse = generateDemoResponse(inputMessage);
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: demoResponse.response,
          timestamp: new Date(),
          queryType: demoResponse.queryType,
          recommendations: demoResponse.recommendations,
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1000);
      } else {
        // Real API call
        const response = await fetch("/api/chatbot/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            message: inputMessage,
            context: conversationId
              ? { conversation_id: conversationId }
              : null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setConversationId(data.conversation_id);

          const assistantMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
            queryType: data.query_type,
            recommendations: data.recommendations,
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error("Failed to get response");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("explain") || lowerMessage.includes("what")) {
      return {
        response:
          "I'd be happy to explain that for you! In simple terms, legal clauses are specific provisions in contracts that define rights, obligations, or conditions. For example, a confidentiality clause protects sensitive information from being shared with unauthorized parties. Would you like me to explain a specific clause or legal concept?",
        queryType: "explanation",
        recommendations: [
          "Would you like me to explain any specific terms?",
          "Do you have a clause you'd like me to analyze?",
          "Would you like examples of common clause types?",
        ],
      };
    } else if (
      lowerMessage.includes("draft") ||
      lowerMessage.includes("create")
    ) {
      return {
        response:
          "I can help you draft various legal documents! To create an effective document, I'll need some information about your needs. What type of document are you looking to draft? (e.g., service agreement, employment contract, NDA). I can guide you through the process and suggest appropriate clauses based on your requirements.",
        queryType: "drafting",
        recommendations: [
          "What type of contract do you need?",
          "Who are the parties involved?",
          "What are the key terms and conditions?",
        ],
      };
    } else if (
      lowerMessage.includes("risk") ||
      lowerMessage.includes("analyze")
    ) {
      return {
        response:
          "Risk analysis is crucial in legal documents. I can help identify potential legal, financial, and operational risks in contracts. Common risk factors include unlimited liability clauses, vague termination terms, and inadequate intellectual property protections. Would you like me to analyze a specific document or clause for risks?",
        queryType: "analysis",
        recommendations: [
          "Upload a document for comprehensive analysis",
          "Share a specific clause for risk assessment",
          "Would you like risk mitigation strategies?",
        ],
      };
    } else {
      return {
        response:
          "I'm here to help with all your legal document needs! I can assist with:\n\n• Explaining complex legal terms and clauses\n• Analyzing documents for risks and compliance\n• Drafting contracts and agreements\n• Providing legal research and guidance\n• Negotiation support and redline suggestions\n\nWhat specific legal matter can I help you with today?",
        queryType: "general",
        recommendations: [
          "Ask about specific legal terms",
          "Upload a document for analysis",
          "Request help with contract drafting",
        ],
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "Explain confidentiality clause",
    "Analyze contract risk",
    "Draft service agreement",
    "What is force majeure?",
    "Help with negotiations",
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setConversationId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      {/* Chat Window */}
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md h-[32rem] flex flex-col border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Legal Assistant</h3>
              <p className="text-xs opacity-75">
                {demoMode ? "Demo Mode" : "AI-Powered"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Clear chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : message.isError
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-white text-gray-900 dark:bg-slate-700 dark:text-white shadow-sm border border-gray-200 dark:border-slate-600"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.recommendations &&
                  message.recommendations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                      <p className="text-xs font-medium mb-1">Suggestions:</p>
                      <div className="space-y-1">
                        {message.recommendations.map((rec, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickAction(rec)}
                            className="block text-xs text-blue-600 dark:text-blue-400 hover:underline text-left"
                          >
                            • {rec}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Quick actions:
            </p>
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-lg">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about legal documents..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-sm"
                rows="2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
