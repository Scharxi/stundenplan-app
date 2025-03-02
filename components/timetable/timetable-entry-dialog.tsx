"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, Day } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SubjectForm } from "./subject-form";

interface TimetableEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: Day | null;
  timeSlotId: string | null;
  entryId: string | null;
}

export function TimetableEntryDialog({
  open,
  onOpenChange,
  day,
  timeSlotId,
  entryId,
}: TimetableEntryDialogProps) {
  const { timetables, activeTimetableId, addEntry, updateEntry, deleteEntry, addSubject } = useTimetableStore();
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  
  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  
  // Use useMemo to prevent recalculation on every render
  const entry = useMemo(() => {
    return entryId && activeTimetable 
      ? activeTimetable.entries.find((e) => e.id === entryId) 
      : null;
  }, [entryId, activeTimetable]);
  
  // Wenn ein Eintrag bearbeitet wird, lade die Daten
  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    
    if (entry) {
      setSelectedSubjectId(entry.subjectId);
      setNotes(entry.notes || "");
    } else {
      setSelectedSubjectId("");
      setNotes("");
    }
  }, [entry, open]);
  
  // Wenn der Dialog geschlossen wird, setze die Formularwerte zurück
  useEffect(() => {
    if (!open) {
      setSelectedSubjectId("");
      setNotes("");
      setIsPopoverOpen(false);
    }
  }, [open]);
  
  const handleSave = () => {
    if (!activeTimetableId) {
      toast.error("Kein aktiver Stundenplan ausgewählt");
      return;
    }
    
    if (!selectedSubjectId) {
      toast.error("Bitte wähle ein Fach aus");
      return;
    }
    
    try {
      if (entry) {
        // Bestehenden Eintrag aktualisieren
        updateEntry(activeTimetableId, entry.id, {
          subjectId: selectedSubjectId,
          notes: notes.trim() || undefined,
        });
        toast.success("Eintrag aktualisiert");
      } else if (day && timeSlotId) {
        // Neuen Eintrag hinzufügen
        addEntry(activeTimetableId, {
          day,
          timeSlotId,
          subjectId: selectedSubjectId,
          notes: notes.trim() || undefined,
        });
        toast.success("Eintrag hinzugefügt");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Speichern des Eintrags");
      console.error(error);
    }
  };
  
  const handleDelete = () => {
    if (!activeTimetableId || !entry) return;
    
    try {
      deleteEntry(activeTimetableId, entry.id);
      toast.success("Eintrag gelöscht");
      onOpenChange(false);
    } catch (error) {
      toast.error("Fehler beim Löschen des Eintrags");
      console.error(error);
    }
  };
  
  const handleAddNewSubject = (name: string, color: string, teacher?: string, room?: string) => {
    if (!activeTimetableId) return "";
    
    const id = addSubject(activeTimetableId, {
      name,
      color,
      teacher,
      room,
    });
    
    setSelectedSubjectId(id);
    setIsSubjectFormOpen(false);
    return id;
  };

  const handleOpenSubjectForm = () => {
    setIsPopoverOpen(false);
    setIsSubjectFormOpen(true);
  };
  
  // Bestimme den Titel des Dialogs
  const getDialogTitle = () => {
    if (entry) return "Eintrag bearbeiten";
    if (day && timeSlotId) {
      const timeSlot = activeTimetable?.timeSlots.find((ts) => ts.id === timeSlotId);
      return `Neuer Eintrag für ${DAY_LABELS[day]}, ${timeSlot?.startTime} - ${timeSlot?.endTime}`;
    }
    return "Eintrag";
  };
  
  if (!activeTimetable) {
    return null;
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {entry
                ? "Bearbeite die Details des Eintrags"
                : day && timeSlotId
                ? `Neuer Eintrag für ${DAY_LABELS[day]}`
                : "Füge einen neuen Eintrag hinzu"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Fach
                </label>
                <div className="flex gap-2">
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedSubjectId ? (
                          <div className="flex items-center">
                            {(() => {
                              const subject = activeTimetable.subjects.find(
                                (s) => s.id === selectedSubjectId
                              );
                              return subject ? (
                                <>
                                  <div
                                    className={cn(
                                      "mr-2 h-3 w-3 rounded-full",
                                      subject.color?.split(" ")[0]
                                    )}
                                  />
                                  <span>{subject.name}</span>
                                </>
                              ) : (
                                "Fach auswählen"
                              );
                            })()}
                          </div>
                        ) : (
                          "Fach auswählen"
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Fach suchen..." />
                        <CommandList>
                          <CommandEmpty>
                            <div className="p-2 text-center">
                              <p className="text-sm text-muted-foreground">
                                Kein Fach gefunden
                              </p>
                              <Button
                                variant="outline"
                                className="mt-2 w-full"
                                onClick={handleOpenSubjectForm}
                              >
                                Neues Fach erstellen
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            {activeTimetable.subjects.map((subject) => (
                              <CommandItem
                                key={subject.id}
                                value={subject.id}
                                onSelect={(value) => {
                                  setSelectedSubjectId(value);
                                  setIsPopoverOpen(false);
                                }}
                                className="flex items-center"
                              >
                                <div
                                  className={cn(
                                    "mr-2 h-4 w-4 rounded-full",
                                    subject.color?.split(" ")[0]
                                  )}
                                />
                                {subject.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    selectedSubjectId === subject.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOpenSubjectForm}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notizen
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notizen zum Eintrag (optional)"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            {entry && (
              <Button variant="destructive" onClick={handleDelete}>
                Löschen
              </Button>
            )}
            <div className={cn("flex gap-2", !entry && "ml-auto")}>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSave}>Speichern</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog zum Hinzufügen eines neuen Fachs */}
      <SubjectForm
        open={isSubjectFormOpen}
        onOpenChange={setIsSubjectFormOpen}
        onSave={handleAddNewSubject}
      />
    </>
  );
} 