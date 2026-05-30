"use client";

import { useState } from "react";
import { useDashboard, Task } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function TasksTab() {
  const { tasks, setTasks, projects, team } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const [formData, setFormData] = useState<Partial<Task>>({
    description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: undefined
  });

  const handleOpenDialog = (task?: Task) => {
    if (task) { setFormData(task); setEditingId(task.id); } 
    else { setFormData({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: undefined }); setEditingId(null); }
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTasks(tasks.map(t => t.id === editingId ? { ...formData, id: editingId } as Task : t));
    } else {
      setTasks([...tasks, { ...formData, id: `t${Date.now()}` } as Task]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar tarea?")) setTasks(tasks.filter(t => t.id !== id));
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Tareas</h2>
        <Button onClick={() => handleOpenDialog()}>Nueva Tarea</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>Descripción</Label><Input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proyecto</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                  <option value="">Seleccione...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Responsable (Usuario)</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}>
                  <option value="">Seleccione...</option>
                  {team.map(m => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="Pendiente">Pendiente</option><option value="En Progreso">En Progreso</option><option value="Completada">Completada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <select className="w-full h-10 border rounded-md px-3 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                  <option value="Baja">Baja</option><option value="Media">Media</option><option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Fecha Límite (Dateline)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">{formData.dateline ? format(formData.dateline, "PPP") : <span>Elegir fecha</span>}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.dateline} onSelect={date => setFormData({...formData, dateline: date})} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground"><tr><th className="p-3">Descripción</th><th className="p-3">Estado/Prioridad</th><th className="p-3">Responsable</th><th className="p-3">Acciones</th></tr></thead>
          <tbody>
            {currentTasks.map(t => (
              <tr key={t.id} className="border-b">
                <td className="p-3 font-medium">{t.description}</td>
                <td className="p-3">{t.status} | {t.priority}</td>
                <td className="p-3">{team.find(m => m.userId === t.userId)?.name || "Sin asignar"}</td>
                <td className="p-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(t)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente de Paginación de Shadcn */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if(currentPage > 1) setCurrentPage(currentPage - 1); }} /></PaginationItem>
            <PaginationItem><PaginationLink href="#">{currentPage} de {totalPages}</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) setCurrentPage(currentPage + 1); }} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}