'use client'

import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MeditationCard from "./MeditationCard";
import { useMemo, useState } from "react";

const meditations = [
  { id: "1", title: "Morning Gratitude", duration: "~5 min", theme: "Gratitude", image: "/images/stress-relief-meditation.png", imageHint: "sunrise serene", audioSrc: "/audio/morning-gratitude.mp3" },
  { id: "2", title: "Stress Reduction", duration: "~5 min", theme: "Stress Relief", image: "/images/rain-cover.png", imageHint: "calm lake", audioSrc: "/audio/stress-reduction.mp3" },
  { id: "5", title: "Body Scan", duration: "~5 min", theme: "Awareness", image: "/images/focus-breathing.png", imageHint: "person meditating", audioSrc: "/audio/body-scan.mp3" },
];


export default function MeditationsPage() {
  // In a real app, search and filter would be dynamic

  const [searchQuery, setSearchQuery] = useState('') 

  const meditationsMemo = useMemo(() => {
    return meditations.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-semibold text-foreground">Meditation Library</h1>
        <p className="text-xl text-muted-foreground font-body">
          Find a guided meditation that suits your needs.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search meditations..." onChange={e => setSearchQuery(e.target.value)} className="pl-10 font-body" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px] font-body">
            <ListFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            <SelectItem value="gratitude">Gratitude</SelectItem>
            <SelectItem value="stress-relief">Stress Relief</SelectItem>
            <SelectItem value="sleep">Sleep</SelectItem>
            <SelectItem value="focus">Focus</SelectItem>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="compassion">Compassion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meditationsMemo.map((meditation) => (
          <MeditationCard key={meditation.id} meditation={meditation} />
        ))}
      </div>
    </div>
  );
}
