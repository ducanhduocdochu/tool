import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch keywords once
  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then(setKeywords)
      .catch(() => {});
  }, []);

  // Fetch transactions whenever filters or page change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(currentPage),
      pageSize: String(pageSize),
      ...(searchTerm && { search: searchTerm }),
      ...(selectedKeyword && { keywordId: selectedKeyword }),
      ...(selectedType && { type: selectedType }),
    });

    fetch(`/api/transactions?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setTransactions(json.data);
        setTotalPages(json.meta.totalPages);
      })
      .catch((err) => setError(err.message || "Lỗi khi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [searchTerm, selectedKeyword, selectedType, currentPage]);

  // Reset to first page on filter change
  useEffect(() => setCurrentPage(1), [searchTerm, selectedKeyword, selectedType]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin w-8 h-8 text-gray-500" /></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Tìm kiếm mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] border p-2 rounded-lg"
          />
          <select
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            className="border p-2 rounded-lg cursor-pointer"
          >
            <option className="dark:text-black cursor-pointer" value="">Tất cả keywords</option>
            {keywords.map((kw) => (
              <option className="dark:text-black cursor-pointer" key={kw.id} value={kw.id}>{kw.phrase}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2 rounded-lg cursor-pointer"
          >
            <option className="dark:text-black cursor-pointer" value="">Tất cả loại</option>
            <option className="dark:text-black cursor-pointer" value="income">Thu vào (+)</option>
            <option className="dark:text-black cursor-pointer" value="expense">Chi ra (-)</option>
          </select>
        </div>

        <ScrollArea className="h-[430px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Keyword</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.timestamp).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                  <TableCell>{tx.account.name}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell className={`text-right ${tx.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                    {tx.type === "expense" ? "-" : "+"}{new Intl.NumberFormat("vi-VN").format(Math.abs(tx.amount))}
                  </TableCell>
                  <TableCell>{tx.keyword?.phrase || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <Button className="cursor-pointer" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
            <Button className="cursor-pointer" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}