'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from 'ai/react'
import { MessageSquare, MessageSquareOff } from 'lucide-react'
import { useState } from 'react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <MessageSquareOff />
        ) : (
          <MessageSquare />
        )}
      </Button>
      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-80">
          <CardHeader>
            <CardTitle>Asistente virtual</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full pr-4">
              {messages.map(m => (
                <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
              />
              <Button type="submit">Enviar</Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

