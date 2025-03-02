"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Farboptionen für Fächer
const COLOR_OPTIONS = [
  { value: "bg-blue-100 text-blue-800 border-blue-200", label: "Blau", preview: "bg-blue-500" },
  { value: "bg-red-100 text-red-800 border-red-200", label: "Rot", preview: "bg-red-500" },
  { value: "bg-green-100 text-green-800 border-green-200", label: "Grün", preview: "bg-green-500" },
  { value: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Gelb", preview: "bg-yellow-500" },
  { value: "bg-purple-100 text-purple-800 border-purple-200", label: "Lila", preview: "bg-purple-500" },
  { value: "bg-pink-100 text-pink-800 border-pink-200", label: "Pink", preview: "bg-pink-500" },
  { value: "bg-indigo-100 text-indigo-800 border-indigo-200", label: "Indigo", preview: "bg-indigo-500" },
  { value: "bg-orange-100 text-orange-800 border-orange-200", label: "Orange", preview: "bg-orange-500" },
  { value: "bg-teal-100 text-teal-800 border-teal-200", label: "Türkis", preview: "bg-teal-500" },
  { value: "bg-cyan-100 text-cyan-800 border-cyan-200", label: "Cyan", preview: "bg-cyan-500" },
];

interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, color: string, teacher?: string, room?: string) => string;
}

export function SubjectForm({ open, onOpenChange, onSave }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Bitte gib einen Namen für das Fach ein");
      return;
    }
    
    try {
      onSave(
        name.trim(), 
        color,
        teacher.trim() || undefined,
        room.trim() || undefined
      );
      resetForm();
      toast.success("Fach erstellt");
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Erstellen des Fachs");
      console.error(error);
    }
  };

  const resetForm = () => {
    setName("");
    setColor(COLOR_OPTIONS[0].value);
    setTeacher("");
    setRoom("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Fach erstellen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject-name">Name *</Label>
              <Input
                id="subject-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Mathematik"
                autoFocus
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject-color">Farbe</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="subject-color" className="w-full">
                  <SelectValue placeholder="Farbe auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${option.preview}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject-teacher">Fachlehrer</Label>
              <Input
                id="subject-teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="z.B. Herr Müller"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject-room">Raum</Label>
              <Input
                id="subject-room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="z.B. A123"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 