"use client";

import { useState } from "react";
import { useDashboard, TeamMember } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export function TeamTab() {
  const { team, setTeam, projects } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estado del formulario con todos los campos requeridos
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    role: "", name: "", email: "", position: "", birthdate: undefined, phone: "", projectId: "", isActive: true,
  });

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setFormData(member);
      setEditingId(member.userId);
    } else {
      setFormData({ role: "", name: "", email: "", position: "", birthdate: undefined, phone: "", projectId: "", isActive: true });
      setEditingId(null);
    }
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Actualizar
      setTeam(team.map(m => m.userId === editingId ? { ...formData, userId: editingId } as TeamMember : m));
    } else {
      // Crear
      setTeam([...team, { ...formData, userId: `u${Date.now()}` } as TeamMember]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar a este miembro del equipo?")) {
      setTeam(team.filter(m => m.userId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Equipo</h2>
        <Button onClick={() => handleOpenDialog()}>Agregar Miembro</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            
            <div className="space-y-2"><Label>Nombre</Label><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>Rol</Label><Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ej. Admin, User" /></div>
            <div className="space-y-2"><Label>Posición</Label><Input required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
            
            <div className="space-y-2">
              <Label>Proyecto Asignado</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                <option value="">Seleccione un proyecto</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Componente Calendar requerido por el laboratorio */}
            <div className="space-y-2 flex flex-col justify-end">
              <Label>Fecha de Nacimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    {formData.birthdate ? format(formData.birthdate, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.birthdate} onSelect={date => setFormData({...formData, birthdate: date})} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex items-center gap-2 mt-8">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-4 w-4" />
              <Label>Usuario Activo</Label>
            </div>

            <Button type="submit" className="col-span-2 mt-4">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tabla de Lectura (Read) */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Rol / Posición</th>
              <th className="px-4 py-3">Email / Teléfono</th>
              <th className="px-4 py-3">Proyecto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.userId} className="border-b">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3">{m.role} <br/><span className="text-xs text-muted-foreground">{m.position}</span></td>
                <td className="px-4 py-3">{m.email} <br/><span className="text-xs text-muted-foreground">{m.phone}</span></td>
                <td className="px-4 py-3">{projects.find(p => p.id === m.projectId)?.name || "Sin asignar"}</td>
                <td className="px-4 py-3">{m.isActive ? <span className="text-green-600">Activo</span> : <span className="text-red-600">Inactivo</span>}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(m)}>Editar</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(m.userId)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}