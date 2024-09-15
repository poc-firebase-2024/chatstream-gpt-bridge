import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';

const Chat = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const { refetch, isFetching } = useQuery({
    queryKey: ['prompt'],
    queryFn: async () => {
      const res = await fetch('http://localhost:9090/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model_name: "Salesforce/codegen-350M-multi"
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
        result += chunk;
        setChatHistory(prevHistory => [
          ...prevHistory,
          { type: 'system', content: chunk }
        ]);
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

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-4">{t('chat')}</h2>
      <div className="flex-grow overflow-y-auto mb-4 bg-gray-100 p-4 rounded-lg">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
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
