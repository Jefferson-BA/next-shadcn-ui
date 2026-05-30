"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner"; 

export function ProjectsTab() {
  const { projects, setProjects } = useDashboard();
  
  // Estados para el formulario de creación
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState(""); 
  
  // Estados para UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !description || !teamMembers) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newProject = {
        id: `p${Date.now()}`,
        name,
        description,
        teamMembers: teamMembers.split(",").map((member) => member.trim()),
      };

      setProjects([...projects, newProject]);
      
      setName("");
      setDescription("");
      setTeamMembers("");
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 1500); 
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Proyectos</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Crear Proyecto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Sistema de Ventas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="members">Miembros (separados por coma)</Label>
                <Input id="members" value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} placeholder="ej. u1, u2, admin" />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Spinner className="mr-2 h-4 w-4" /> Guardando...</> : "Guardar Proyecto"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No hay proyectos registrados.</p>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="truncate">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center mt-4">
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalles del Proyecto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {project.id}</p>
                      <p><strong>Nombre:</strong> {project.name}</p>
                      <p><strong>Descripción:</strong> {project.description}</p>
                      <p><strong>Miembros ({project.teamMembers.length}):</strong></p>
                      <ul className="list-disc pl-5">
                        {project.teamMembers.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                  Eliminar
                </Button>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}