'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Tag, Search, ListFilter, PauseCircle } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface MeditationCardInterface {
    meditation: MeditationInterface
}

interface MeditationInterface {
    id: string;
    title: string;
    duration: string;
    theme: string;
    image: string;
    imageHint: string;
    audioSrc: string;

}

const MeditationCard: React.FC<MeditationCardInterface> = ({ meditation }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false)
        }
        else {
            audioRef.current?.play();
            setIsPlaying(true)
        }
    };

    return (
        <Card key={meditation.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Image 
                src={meditation.image} 
                alt={meditation.title} 
                width={600} 
                height={400} 
                className="w-full h-48 object-cover"
                data-ai-hint={meditation.imageHint}
              />
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <CardTitle className="text-2xl font-headline mb-2">{meditation.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Clock className="mr-2 h-4 w-4" />
                <span>{meditation.duration}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Tag className="mr-2 h-4 w-4" />
                <span>{meditation.theme}</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                <audio ref={audioRef} src={meditation.audioSrc} />
                <Button className="w-full font-body" onClick={handlePlay}>
                    {isPlaying ? <PauseCircle className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                    Play Session
                </Button>
            </CardFooter>
          </Card>
    )

}

export default MeditationCard