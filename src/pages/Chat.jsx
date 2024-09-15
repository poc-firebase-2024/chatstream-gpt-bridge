import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from 'lucide-react';

const Chat = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [model, setModel] = useState("Salesforce/codegen-350M-multi");
  const chatContainerRef = useRef(null);

  const { refetch, isFetching } = useQuery({
    queryKey: ['prompt', model],
    queryFn: async () => {
      const res = await fetch('http://localhost:9090/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model_name: model
        }),
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        try {
          const jsonChunk = JSON.parse(chunk);
          result += jsonChunk.response;
          setChatHistory(prevHistory => {
            const newHistory = [...prevHistory];
            if (newHistory.length > 0 && newHistory[newHistory.length - 1].type === 'system') {
              newHistory[newHistory.length - 1].content += jsonChunk.response;
            } else {
              newHistory.push({ type: 'system', content: jsonChunk.response });
            }
            return newHistory;
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }

      return result;
    },
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatHistory(prevHistory => [
      ...prevHistory,
      { type: 'user', content: prompt }
    ]);
    refetch();
    setPrompt('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <div className="mb-4 flex items-center space-x-4">
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Salesforce/codegen-350M-multi">Salesforce/codegen-350M-multi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 bg-gray-100 p-4 rounded-lg"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {chatHistory.map((message, index) => (
          <div key={index} className="mb-4">
            {message.type === 'system' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="mb-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
            <div
              className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-white text-black'
              }`}
              style={{ maxWidth: '80%', wordWrap: 'break-word' }}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('enterPrompt')}
          className="w-full"
        />
        <Button type="submit" disabled={isFetching}>
          {isFetching ? t('processing') : t('send')}
        </Button>
      </form>
    </div>
  );
};

export default Chat;
