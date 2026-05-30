"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardProvider } from "@/context/DashboardContext";

// Importamos las 5 pestañas dinámicas
import { SummaryTab } from "@/components/dashboard/SummaryTab";
import { ProjectsTab } from "@/components/dashboard/ProjectsTab";
import { TeamTab } from "@/components/dashboard/TeamTab";
import { TasksTab } from "@/components/dashboard/TasksTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Dashboard de Proyectos
            </h1>
            <p className="text-slate-600">
                Sistema completo con CRUD y datos en memoria (Context)
            </p>
        </div>
        
        <Tabs defaultValue="summary" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary"><SummaryTab /></TabsContent>
          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="team"><TeamTab /></TabsContent>
          <TabsContent value="tasks"><TasksTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </DashboardProvider>
  );
}