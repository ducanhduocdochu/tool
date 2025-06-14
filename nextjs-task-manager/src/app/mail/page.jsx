'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { MailIcon, PlusIcon } from 'lucide-react'
import LoginForm from '@/components/LoginForm'

export default function EmailManager() {
  const [authenticated, setAuthenticated] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState([
    { id: 'gmail_1', label: 'Gmail - john@gmail.com' },
    { id: 'outlook_1', label: 'Outlook - john@outlook.com' },
  ])
  const [selectedEmailId, setSelectedEmailId] = useState(null)
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MailIcon className="w-6 h-6" />
        Quản lý tài khoản Email
      </h1>

      {/* Nút thêm email */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 w-4 h-4" />
            Thêm Email
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm tài khoản Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nhập địa chỉ email..." />
            <Button variant="secondary" disabled>
              Xác thực (OAuth) - Tạm thời chưa xử lý
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit" disabled>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chọn email */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Select onValueChange={setSelectedEmailId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tài khoản email" />
            </SelectTrigger>
            <SelectContent>
              {emailAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button disabled={!selectedEmailId}>
            Fetch Email chưa đọc
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
