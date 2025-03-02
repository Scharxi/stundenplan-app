"use client";

import React, { useState } from "react";
import { CalendarClock, Clock, Edit, Plus, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { useTimetableStore } from "@/lib/store";
import { DAY_LABELS, Day } from "@/lib/types";
import { sortTimeSlots } from "@/lib/utils";
import { TimetableForm } from "./timetable-form";
import { TimeSlotForm } from "./time-slot-form";
import { SubjectForm } from "./subject-form";
import { BreakForm } from "./break-form";
import { TimetableGrid } from "./timetable-grid";

export function TimetableManager() {
  const { timetables, activeTimetableId, setActiveTimetable } = useTimetableStore();
  
  const [isTimetableFormOpen, setIsTimetableFormOpen] = useState(false);
  const [isTimeSlotFormOpen, setIsTimeSlotFormOpen] = useState(false);
  const [isSubjectFormOpen, setIsSubjectFormOpen] = useState(false);
  const [isBreakFormOpen, setIsBreakFormOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState<string | undefined>(undefined);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | undefined>(undefined);
  const [selectedBreakId, setSelectedBreakId] = useState<string | undefined>(undefined);
  
  const activeTimetable = timetables.find((t) => t.id === activeTimetableId);
  const sortedTimeSlots = activeTimetable ? sortTimeSlots(activeTimetable.timeSlots) : [];
  
  const handleCreateTimetable = () => {
    setSelectedTimetableId(undefined);
    setIsTimetableFormOpen(true);
  };
  
  const handleEditTimetable = (id: string) => {
    setSelectedTimetableId(id);
    setIsTimetableFormOpen(true);
  };
  
  const handleCreateTimeSlot = () => {
    if (!activeTimetableId) {
      toast.error("Bitte wähle zuerst einen Stundenplan aus");
      return;
    }
    
    setSelectedTimeSlotId(undefined);
    setIsTimeSlotFormOpen(true);
  };
  
  const handleEditTimeSlot = (id: string) => {
    setSelectedTimeSlotId(id);
    setIsTimeSlotFormOpen(true);
  };
  
  const handleCreateSubject = () => {
    if (!activeTimetableId) {
      toast.error("Bitte wähle zuerst einen Stundenplan aus");
      return;
    }
    
    setIsSubjectFormOpen(true);
  };
  
  const handleCreateBreak = () => {
    if (!activeTimetableId) {
      toast.error("Bitte wähle zuerst einen Stundenplan aus");
      return;
    }
    
    setSelectedBreakId(undefined);
    setIsBreakFormOpen(true);
  };
  
  const handleEditBreak = (id: string) => {
    setSelectedBreakId(id);
    setIsBreakFormOpen(true);
  };
  
  const handleSelectTimetable = (id: string) => {
    setActiveTimetable(id);
    toast.success("Stundenplan ausgewählt");
  };
  
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="timetable" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Stundenplan
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {activeTimetable ? activeTimetable.name : "Stundenplan auswählen"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timetables.length === 0 ? (
                  <DropdownMenuItem disabled>
                    Keine Stundenpläne vorhanden
                  </DropdownMenuItem>
                ) : (
                  timetables.map((timetable) => (
                    <DropdownMenuItem
                      key={timetable.id}
                      onClick={() => handleSelectTimetable(timetable.id)}
                      className={
                        timetable.id === activeTimetableId ? "bg-muted" : ""
                      }
                    >
                      {timetable.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleCreateTimetable}>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Stundenplan
            </Button>
          </div>
        </div>
        
        <TabsContent value="timetable" className="space-y-6">
          <TimetableGrid />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stundenpläne */}
            <Card>
              <CardHeader>
                <CardTitle>Stundenpläne</CardTitle>
                <CardDescription>
                  Verwalte deine Stundenpläne
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {timetables.length === 0 ? (
                  <p className="text-muted-foreground">
                    Keine Stundenpläne vorhanden
                  </p>
                ) : (
                  timetables.map((timetable) => (
                    <div
                      key={timetable.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <span>{timetable.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTimetable(timetable.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateTimetable} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Stundenplan
                </Button>
              </CardFooter>
            </Card>
            
            {/* Zeitslots */}
            <Card>
              <CardHeader>
                <CardTitle>Zeitslots</CardTitle>
                <CardDescription>
                  Verwalte die Zeitslots für den aktiven Stundenplan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!activeTimetable ? (
                  <p className="text-muted-foreground">
                    Kein Stundenplan ausgewählt
                  </p>
                ) : sortedTimeSlots.length === 0 ? (
                  <p className="text-muted-foreground">
                    Keine Zeitslots vorhanden
                  </p>
                ) : (
                  sortedTimeSlots.map((timeSlot) => (
                    <div
                      key={timeSlot.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {timeSlot.startTime} - {timeSlot.endTime}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTimeSlot(timeSlot.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateTimeSlot}
                  className="w-full"
                  disabled={!activeTimetable}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Zeitslot
                </Button>
              </CardFooter>
            </Card>
            
            {/* Fächer */}
            <Card>
              <CardHeader>
                <CardTitle>Fächer</CardTitle>
                <CardDescription>
                  Verwalte die Fächer für den aktiven Stundenplan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!activeTimetable ? (
                  <p className="text-muted-foreground">
                    Kein Stundenplan ausgewählt
                  </p>
                ) : activeTimetable.subjects.length === 0 ? (
                  <p className="text-muted-foreground">
                    Keine Fächer vorhanden
                  </p>
                ) : (
                  activeTimetable.subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 ${
                            subject.color?.split(" ")[0]
                          }`}
                        />
                        <span>{subject.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateSubject}
                  className="w-full"
                  disabled={!activeTimetable}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Neues Fach
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pausen */}
            <Card>
              <CardHeader>
                <CardTitle>Pausen</CardTitle>
                <CardDescription>
                  Verwalte die Pausen für den aktiven Stundenplan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!activeTimetable ? (
                  <p className="text-muted-foreground">
                    Kein Stundenplan ausgewählt
                  </p>
                ) : !activeTimetable.breaks || activeTimetable.breaks.length === 0 ? (
                  <p className="text-muted-foreground">
                    Keine Pausen vorhanden
                  </p>
                ) : (
                  activeTimetable.breaks.map((breakItem) => {
                    const timeSlot = activeTimetable.timeSlots.find(
                      (ts) => ts.id === breakItem.timeSlotId
                    );
                    
                    return (
                      <div
                        key={breakItem.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{breakItem.name}</span>
                          {timeSlot && (
                            <span className="text-xs text-muted-foreground">
                              {timeSlot.startTime} - {timeSlot.endTime}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {breakItem.days.map((day) => DAY_LABELS[day]).join(", ")}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBreak(breakItem.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateBreak}
                  className="w-full"
                  disabled={!activeTimetable}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Neue Pause
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <TimetableForm
        open={isTimetableFormOpen}
        onOpenChange={setIsTimetableFormOpen}
        timetableId={selectedTimetableId}
      />
      
      <TimeSlotForm
        open={isTimeSlotFormOpen}
        onOpenChange={setIsTimeSlotFormOpen}
        timeSlotId={selectedTimeSlotId}
      />
      
      <SubjectForm
        open={isSubjectFormOpen}
        onOpenChange={setIsSubjectFormOpen}
        onSave={(name, color, teacher, room) => {
          if (!activeTimetableId) return "";
          
          const id = useTimetableStore.getState().addSubject(activeTimetableId, {
            name,
            color,
            teacher,
            room
          });
          
          toast.success("Fach hinzugefügt");
          return id;
        }}
      />
      
      <BreakForm
        open={isBreakFormOpen}
        onOpenChange={setIsBreakFormOpen}
        breakId={selectedBreakId}
      />
    </div>
  );
} 