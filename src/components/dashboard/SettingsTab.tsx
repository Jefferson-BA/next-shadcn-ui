"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export function SettingsTab() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl bg-card p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Configuración del Sistema</h2>
      
      {saved && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">¡Éxito!</AlertTitle>
          <AlertDescription className="text-green-700">Las configuraciones se han guardado en memoria.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <Label>Nombre de la Empresa</Label>
          <Input defaultValue="Mi Empresa S.A.C." />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label>Notificaciones por correo</Label>
          <select className="h-10 rounded-md border border-input px-3">
            <option>Solo alertas importantes</option>
            <option>Todas las notificaciones</option>
            <option>Ninguna</option>
          </select>
        </div>
        <div className="space-y-2 flex flex-col">
          <Label>Idioma por defecto</Label>
          <select className="h-10 rounded-md border border-input px-3">
            <option>Español</option>
            <option>Inglés</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <><Spinner className="mr-2 h-4 w-4"/> Guardando...</> : "Guardar Preferencias"}
        </Button>
      </form>
    </div>
  );
}