"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { LucideIcon } from "lucide-react";

interface SoundscapeCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: (id: string) => void;
  onVolumeChange: (id: string, value: number[]) => void;
}