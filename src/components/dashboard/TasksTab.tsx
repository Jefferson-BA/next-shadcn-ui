"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function TasksTab() {
  const { tasks, setTasks } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title,
      status,
      date: date ? date.toLocaleDateString() : "Sin fecha",
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setStatus("Pendiente");
    setDate(undefined);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lista de Tareas</h2>
          <p className="text-sm text-slate-500">Gestiona y asigna las entregas de tu equipo</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Agregar Tarea</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Tareas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Título de la tarea</Label>
                <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Diseñar prototipo" />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {date ? date.toLocaleDateString() : <span>Elegir fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {/* Se removió 'initialFocus' para evitar errores de tipo */}
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full">Guardar Tarea</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                  No hay tareas registradas.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.date || "Sin fecha"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={task.status === "Completado" ? "default" : "secondary"}>
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}