"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, DAYS, Day } from "@/lib/types";
import { sortTimeSlots } from "@/lib/utils";

interface FreeBlockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  freeBlockId?: string;
}

// Farboptionen für Freiblöcke
const COLOR_OPTIONS = [
  { value: "bg-gray-100 text-gray-800 border-gray-200", label: "Grau" },
  { value: "bg-blue-100 text-blue-800 border-blue-200", label: "Blau" },
  { value: "bg-green-100 text-green-800 border-green-200", label: "Grün" },
  { value: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Gelb" },
  { value: "bg-purple-100 text-purple-800 border-purple-200", label: "Lila" },
  { value: "bg-pink-100 text-pink-800 border-pink-200", label: "Rosa" },
];

export function FreeBlockForm({ open, onOpenChange, freeBlockId }: FreeBlockFormProps) {
  const { timetables, activeTimetableId, addFreeBlock, updateFreeBlock, deleteFreeBlock } = useTimetableStore();
  
  const [description, setDescription] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  
  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  
  // Use useMemo to prevent recalculation on every render
  const sortedTimeSlots = useMemo(() => {
    return activeTimetable ? sortTimeSlots(activeTimetable.timeSlots) : [];
  }, [activeTimetable]);
  
  const freeBlock = useMemo(() => {
    return freeBlockId && activeTimetable 
      ? activeTimetable.freeBlocks?.find((fb) => fb.id === freeBlockId) 
      : undefined;
  }, [freeBlockId, activeTimetable]);
  
  // Wenn ein Freiblock bearbeitet wird, lade die Daten
  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    
    if (freeBlock) {
      setDescription(freeBlock.description || "");
      setTimeSlotId(freeBlock.timeSlotId);
      setSelectedDays([...freeBlock.days]); // Create a new array to avoid reference issues
      setColor(freeBlock.color || COLOR_OPTIONS[0].value);
    } else {
      setDescription("");
      setTimeSlotId(sortedTimeSlots.length > 0 ? sortedTimeSlots[0].id : "");
      setSelectedDays([]);
      setColor(COLOR_OPTIONS[0].value);
    }
  }, [freeBlock, sortedTimeSlots, open]);
  
  const handleSave = () => {
    if (!activeTimetableId) {
      toast.error("Kein aktiver Stundenplan ausgewählt");
      return;
    }
    
    if (!timeSlotId) {
      toast.error("Bitte wähle einen Zeitslot aus");
      return;
    }
    
    if (selectedDays.length === 0) {
      toast.error("Bitte wähle mindestens einen Tag aus");
      return;
    }
    
    try {
      if (freeBlockId) {
        // Bestehenden Freiblock aktualisieren
        updateFreeBlock(activeTimetableId, freeBlockId, {
          description: description.trim() || undefined,
          timeSlotId,
          days: selectedDays,
          color,
        });
        toast.success("Freiblock aktualisiert");
      } else {
        // Neuen Freiblock hinzufügen
        addFreeBlock(activeTimetableId, {
          description: description.trim() || undefined,
          timeSlotId,
          days: selectedDays,
          color,
        });
        toast.success("Freiblock hinzugefügt");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Speichern des Freiblocks");
      console.error(error);
    }
  };
  
  const handleDelete = () => {
    if (!activeTimetableId || !freeBlockId) return;
    
    try {
      deleteFreeBlock(activeTimetableId, freeBlockId);
      toast.success("Freiblock gelöscht");
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Löschen des Freiblocks");
      console.error(error);
    }
  };
  
  const handleDayToggle = (day: Day) => {
    setSelectedDays((prev) => 
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };
  
  if (!activeTimetable) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{freeBlockId ? "Freiblock bearbeiten" : "Neuen Freiblock erstellen"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="free-block-description">Beschreibung</Label>
            <Input
              id="free-block-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. Selbststudium, Mittagspause, etc."
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="free-block-timeslot">Zeitslot *</Label>
            <Select value={timeSlotId} onValueChange={setTimeSlotId}>
              <SelectTrigger id="free-block-timeslot">
                <SelectValue placeholder="Zeitslot auswählen" />
              </SelectTrigger>
              <SelectContent>
                {sortedTimeSlots.map((timeSlot) => (
                  <SelectItem key={timeSlot.id} value={timeSlot.id}>
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="free-block-color">Farbe</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="free-block-color">
                <SelectValue placeholder="Farbe auswählen" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <div 
                        className={`w-4 h-4 rounded-full mr-2 ${option.value.split(" ")[0]}`}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Tage *</Label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`} 
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {DAY_LABELS[day]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {freeBlockId && (
            <Button variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          )}
          <div className={`flex gap-2 ${!freeBlockId && "ml-auto"}`}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 