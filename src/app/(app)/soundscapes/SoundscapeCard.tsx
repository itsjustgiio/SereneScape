import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";


interface SoundscapeCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: (id: string) => void;
  onVolumeChange: (id: string, value: number[]) => void;
}


export const SoundscapeCard: React.FC<SoundscapeCardProps> = ({
  id,
  name,
  icon: Icon,
  isPlaying,
  volume,
  onTogglePlay,
  onVolumeChange,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Icon className="mr-3 h-6 w-6 text-primary" /> {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`play-${id}`} className="font-body text-base">
            {isPlaying ? "Playing" : "Paused"}
          </Label>
          <Switch
            id={`play-${id}`}
            checked={isPlaying}
            onCheckedChange={() => onTogglePlay(id)}
            aria-label={`Toggle ${name} sound`}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`volume-${id}`} className="font-body text-sm">
            Volume: {volume}%
          </Label>
          <Slider
            id={`volume-${id}`}
            max={100}
            step={1}
            value={[volume]}
            onValueChange={(value) => onVolumeChange(id, value)}
            disabled={!isPlaying}
            aria-label={`${name} volume`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundscapeCard