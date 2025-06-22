"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Waves, Trees, CloudRain, Volume2, Sun, Moon, Coffee } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SoundscapeCard from "./SoundscapeCard";

interface Soundscape {
  id: string;
  name: string;
  icon: LucideIcon;
  soundSrc: string;
}

const availableSoundscapes: Soundscape[] = [
  { id: "ocean", name: "Ocean Waves", icon: Waves, soundSrc: "/soundscape/ocean-waves.mp3" },
  { id: "forest", name: "Forest Ambience", icon: Trees, soundSrc: "/soundscape/forest-ambience.mp3" },
  { id: "rain", name: "Gentle Rain", icon: CloudRain, soundSrc: "/soundscape/gentle-rain.mp3" },
  { id: "morning", name: "Morning Birds", icon: Sun, soundSrc: "/soundscape/morning-birds.mp3" },
  { id: "night", name: "Night Crickets", icon: Moon, soundSrc: "/soundscape/night-crickets.mp3" },
  { id: "cafe", name: "Cafe Buzz", icon: Coffee, soundSrc: "/soundscape/cafe-buzz.mp3" },
];

interface SingleSoundscapeState {
  isPlaying: boolean;
  volume: number;
}

type SoundscapeState = Record<string, SingleSoundscapeState>;

export default function SoundscapesPage() {
  const [masterVolume, setMasterVolume] = useState<number[]>([50]);

  const [soundscapeStates, setSoundscapeStates] = useState<SoundscapeState>(
  availableSoundscapes.reduce((acc, curr) => {
    acc[curr.id] = { isPlaying: false, volume: 50 };
    return acc;
  }, {} as SoundscapeState)
);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // On mount, create audio elements
  useEffect(() => {
    availableSoundscapes.forEach(({ id, soundSrc }) => {
      const audio = new Audio(soundSrc);
      audio.loop = true;
      audioRefs.current[id] = audio;
    });
  }, []);

  const handleTogglePlay = (id: string) => {
    setSoundscapeStates((prev) => {
      const newState = !prev[id].isPlaying;
      const audio = audioRefs.current[id];
      if (audio) {
        audio.loop = true;
        if (newState) {
          audio.volume = (prev[id].volume * masterVolume[0]) / 10000;
          audio.play();
        } else {
          audio.pause();
        }
      }
      return {
        ...prev,
        [id]: { ...prev[id], isPlaying: newState },
      };
    });
  };

  const handleVolumeChange = (id: string, value: number[]) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = (value[0] * masterVolume[0]) / 10000;
    }
    setSoundscapeStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: value[0] },
    }));
  };

  useEffect(() => {
    // When master volume changes, update all active audios
    availableSoundscapes.forEach(({ id }) => {
      const audio = audioRefs.current[id];
      if (audio && soundscapeStates[id].isPlaying) {
        audio.volume = (soundscapeStates[id].volume * masterVolume[0]) / 10000;
      }
    });
  }, [masterVolume]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-semibold text-foreground">Ambient Soundscapes</h1>
        <p className="text-xl text-muted-foreground font-body">
          Create your perfect relaxation environment by mixing sounds.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Volume2 className="mr-3 h-6 w-6" /> Master Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={masterVolume}
            onValueChange={setMasterVolume}
            aria-label="Master volume"
          />
          <p className="text-sm text-muted-foreground mt-2 text-center font-body">
            Current Volume: {masterVolume[0]}%
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableSoundscapes.map((sound) => (
          <SoundscapeCard
            key={sound.id}
            id={sound.id}
            name={sound.name}
            icon={sound.icon}
            isPlaying={soundscapeStates[sound.id]?.isPlaying}
            volume={soundscapeStates[sound.id]?.volume}
            onTogglePlay={handleTogglePlay}
            onVolumeChange={handleVolumeChange}
          />
        ))}
      </div>
      <p className="text-sm text-center text-muted-foreground font-body pt-4">
        Note: Audio playback is illustrative in this demo.
      </p>
    </div>
  );
}
