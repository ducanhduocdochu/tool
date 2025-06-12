"use client";

import { useEffect, useState } from "react";
import ChatInterface from "@/components/FinanceBot/ChatInterface";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionList from "@/components/FinanceBot/TransactionList";
import KeywordList from "@/components/FinanceBot/KeywordList";
import AccountList from "@/components/FinanceBot/AccountList";
import Dashboard from "@/components/FinanceBot/Dashboard";

export default function ChatbotPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      });
  }, []);

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="flex justify-between items-center p-4 shadow bg-white dark:bg-zinc-900">
        <h1 className="text-2xl font-bold">🧠 Finance Assistant</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant="outline" size="sm">
                📜 Transactions
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-6xl !w-full">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <TransactionList />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant="outline" size="sm">
                🧩 Keywords
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-6xl !w-full">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <KeywordList />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant="outline" size="sm">
                📊 Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-6xl !w-full">
              <DialogHeader>
                <DialogTitle>Dashboard</DialogTitle>
              </DialogHeader>
              <Dashboard />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mr-12 cursor-pointer"
                variant="outline"
                size="sm"
              >
                💰 Accounts
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-6xl !w-full">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <AccountList />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <ChatInterface />
      </main>
    </div>
  );
}
