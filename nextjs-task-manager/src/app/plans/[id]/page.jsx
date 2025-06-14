"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";

export default function PlanDetailPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [cells, setCells] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);
  const [rowCount, setRowCount] = useState(1);
  const [colCount, setColCount] = useState(1);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteRow, setConfirmDeleteRow] = useState(false);
  const [confirmDeleteCol, setConfirmDeleteCol] = useState(false);
  const [dirtyCells, setDirtyCells] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoadingAction(true);

    fetch(`/api/plans/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Plan not found");
        return res.json();
      })
      .then((data) => {
        setPlan(data);
        const map = {};
        data.data.forEach((cell) => {
          map[`${cell.row}-${cell.column}`] = cell.value;
        });
        setCells(map);

        const rows = data.data.map((c) => c.row);
        const cols = data.data.map((c) => c.column);

        const maxRow = rows.length ? Math.max(...rows) : 0;
        const maxCol = cols.length ? Math.max(...cols) : 0;

        setRowCount(maxRow + 1);
        setColCount(maxCol + 1);
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setLoadingAction(false);
      });
  }, [id]);

  const updateCell = (row, col, value) => {
    const key = `${row}-${col}`;
    setCells((prev) => ({ ...prev, [key]: value }));
    setDirtyCells((prev) => ({ ...prev, [key]: value }));
  };

  const insertRowBelow = async () => {
    setLoadingAction(true);
    const targetRow = selectedCell.row + 1;

    await fetch(`/api/plans/${id}/row`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: targetRow }),
    });

    const newCells = {};
    Object.entries(cells).forEach(([key, val]) => {
      const [r, c] = key.split("-").map(Number);
      if (r >= targetRow) {
        newCells[`${r + 1}-${c}`] = val;
      } else {
        newCells[key] = val;
      }
    });
    setCells(newCells);
    setRowCount((prev) => prev + 1);
    setLoadingAction(false);
  };

  const deleteSelectedRow = async () => {
    setLoadingAction(true);
    if (rowCount <= 1) return alert("Cannot delete.");

    const targetRow = selectedCell.row;

    await fetch(`/api/plans/${id}/row`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: targetRow }),
    });

    const newCells = {};
    Object.entries(cells).forEach(([key, val]) => {
      const [r, c] = key.split("-").map(Number);
      if (r === targetRow) return;
      const newRow = r > targetRow ? r - 1 : r;
      newCells[`${newRow}-${c}`] = val;
    });
    setCells(newCells);
    setRowCount((prev) => prev - 1);
    setLoadingAction(false);
  };

  const insertColRight = async () => {
    setLoadingAction(true);
    const targetCol = selectedCell.col + 1;

    await fetch(`/api/plans/${id}/column`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: targetCol }),
    });

    const newCells = {};
    Object.entries(cells).forEach(([key, val]) => {
      const [r, c] = key.split("-").map(Number);
      if (c >= targetCol) {
        newCells[`${r}-${c + 1}`] = val;
      } else {
        newCells[key] = val;
      }
    });
    setCells(newCells);
    setColCount((prev) => prev + 1);
    setLoadingAction(false);
  };

  const deleteSelectedCol = async () => {
    setLoadingAction(true);
    if (colCount <= 1) return alert("Cannot delete.");

    const targetCol = selectedCell.col;

    await fetch(`/api/plans/${id}/column`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: targetCol }),
    });

    const newCells = {};
    Object.entries(cells).forEach(([key, val]) => {
      const [r, c] = key.split("-").map(Number);
      if (c === targetCol) return;
      const newCol = c > targetCol ? c - 1 : c;
      newCells[`${r}-${newCol}`] = val;
    });
    setCells(newCells);
    setColCount((prev) => prev - 1);
    setLoadingAction(false);
  };

  const saveAllCells = async () => {
    setLoadingAction(true);
    const updates = Object.entries(dirtyCells).map(([key, value]) => {
      const [row, column] = key.split("-").map(Number);
      return { row, column, value };
    });

    await fetch(`/api/plans/${id}/cell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });

    setDirtyCells({});
    setLoadingAction(false);
  };
  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2 max-w-md">
        <label className="text-sm font-medium text-muted-foreground">
          🧾 Plan name:
        </label>
        <Input
          value={plan?.name || ""}
          onChange={(e) =>
            setPlan((prev) => ({ ...prev, name: e.target.value }))
          }
          onBlur={async () => {
            if (!plan?.id) return;
            await fetch(`/api/plans/${plan.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: plan.name }),
            });
          }}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={insertRowBelow}
          >
            ➕ Add row
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => setConfirmDeleteRow(true)}
          >
            🗑 Delete row
          </Button>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={insertColRight}
          >
            ➕ Add column
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => setConfirmDeleteCol(true)}
          >
            🗑 Delete column
          </Button>
        </div>
        <Button
          className="cursor-pointer"
          onClick={saveAllCells}
          disabled={Object.keys(dirtyCells).length === 0}
        >
          💾 Save all
        </Button>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="table-auto w-full border-collapse">
          <tbody>
            {[...Array(rowCount)].map((_, row) => (
              <tr key={row}>
                {[...Array(colCount)].map((_, col) => {
                  const key = `${row}-${col}`;
                  const isSelected =
                    selectedCell.row === row && selectedCell.col === col;
                  return (
                    <td key={col} className="border p-1">
                      <Input
                        value={cells[key] || ""}
                        onChange={(e) => updateCell(row, col, e.target.value)}
                        onFocus={() => setSelectedCell({ row, col })}
                        className={isSelected ? "ring-2 ring-blue-400" : ""}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="cursor-pointer" variant="destructive">
            🗑 Delete plan
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept delete</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete <b>{plan?.name}</b>? Action cannot Ctrl Z.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                const res = await fetch(`/api/plans/${plan.id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  alert("Đã xoá thành công!");
                  window.location.href = "/plans";
                } else {
                  alert("Xoá thất bại!");
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? "Đang xoá..." : "Xoá"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmDeleteRow} onOpenChange={setConfirmDeleteRow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept delete row</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete row {selectedCell.row + 1}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={async () => {
                setLoadingAction(true);
                await deleteSelectedRow();
                setConfirmDeleteRow(false);
                setLoadingAction(false);
              }}
            >
              Delete row
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmDeleteCol} onOpenChange={setConfirmDeleteCol}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept delete column</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete collumn {selectedCell.col + 1}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={async () => {
                setLoadingAction(true);
                await deleteSelectedCol();
                setConfirmDeleteCol(false);
                setLoadingAction(false);
              }}
            >
              Delete Column
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {loadingAction && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-white mb-3"
              xmlns="http://www.w3.org/2000/svg"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="text-white text-sm">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
