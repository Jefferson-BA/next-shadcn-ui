"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Interfaces según los requisitos de tu Tarea
export interface Project {
  id: string;
  name: string;
  description: string;
  teamMembers: string[]; // Requisito: Campo para miembros del equipo
}

export interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: Date | undefined;
  phone: string;
  projectId: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: "Pendiente" | "En Progreso" | "Completada";
  priority: "Baja" | "Media" | "Alta";
  userId: string;
  dateline: Date | undefined;
}

// 2. Interfaz del Contexto
interface DashboardContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// 3. Proveedor del Contexto (Datos Iniciales en memoria)
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", name: "Proyecto Alpha", description: "Migración a la nube", teamMembers: ["u1", "u2"] }
  ]);
  
  const [team, setTeam] = useState<TeamMember[]>([
    { userId: "u1", role: "Admin", name: "Juan Pérez", email: "juan@ejemplo.com", position: "Desarrollador", birthdate: new Date(1990, 5, 15), phone: "987654321", projectId: "p1", isActive: true },
    { userId: "u2", role: "User", name: "Ana Gómez", email: "ana@ejemplo.com", position: "Diseñadora", birthdate: new Date(1995, 8, 20), phone: "912345678", projectId: "p1", isActive: true }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", description: "Configurar Base de Datos", projectId: "p1", status: "Pendiente", priority: "Alta", userId: "u1", dateline: new Date() }
  ]);

  return (
    <DashboardContext.Provider value={{ projects, setProjects, team, setTeam, tasks, setTasks }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard debe usarse dentro de un DashboardProvider");
  return context;
};