import pdfIcon from "../assets/pdf.svg";
import wordIcon from "../assets/word.svg";
import mp3Icon from "../assets/mp3.svg";
import type { FileCardProps } from "../components/ui/types/FileCardProps";

export const mockFiles: FileCardProps[] = [
  {
    id: 1,
    icon: pdfIcon,
    title: "Doc",
    description: "Texto descriptivo del documento PDF.",
    type: "PDF",
  },
  {
    id: 2,
    icon: wordIcon,
    title: "Informe",
    description: "Texto descriptivo del documento Word.",
    type: "Word",
  },
  {
    id: 3,
    icon: mp3Icon,
    title: "Canción 1",
    description: "Texto descriptivo de un archivo de música.",
    type: "MP3",
  },
  {
    id: 4,
    icon: mp3Icon,
    title: "Canción 2",
    description: "Otro archivo de música.",
    type: "MP3",
  },
  {
    id: 5,
    icon: mp3Icon,
    title: "Podcast",
    description: "Archivo de podcast.",
    type: "MP3",
  },
  {
    id: 6,
    icon: mp3Icon,
    title: "Audio Guía",
    description: "Guía de audio para la aplicación.",
    type: "MP3",
  },
];
