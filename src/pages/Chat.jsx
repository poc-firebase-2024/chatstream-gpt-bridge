import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from '@tanstack/react-query';

const Chat = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

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
        setResponse(prevResponse => prevResponse + chunk);
      }

      return result;
    },
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponse('');
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{t('chat')}</h2>
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
      {response && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">{t('response')}:</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default Chat;