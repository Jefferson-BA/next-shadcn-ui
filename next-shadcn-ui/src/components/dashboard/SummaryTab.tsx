"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryTab() {
  const { projects, team, tasks } = useDashboard();
  
  const tareasPendientes = tasks.filter(t => t.status === "Pendiente").length;
  const tareasCompletadas = tasks.filter(t => t.status === "Completada").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader><CardTitle>Total Proyectos</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold text-primary">{projects.length}</p></CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Total Equipo</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold text-primary">{team.length}</p></CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Tareas Pendientes</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold text-red-500">{tareasPendientes}</p></CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Tareas Completadas</CardTitle></CardHeader>
        <CardContent><p className="text-4xl font-bold text-green-500">{tareasCompletadas}</p></CardContent>
      </Card>
    </div>
  );
}