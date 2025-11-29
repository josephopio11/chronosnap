export enum AppState {
  LANDING = 'LANDING',
  CAMERA = 'CAMERA',
  ERA_SELECTION = 'ERA_SELECTION',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface Era {
  id: string;
  name: string;
  description: string;
  prompt: string; // The base prompt for Gemini
  imagePlaceholder: string; // A placeholder image showing the style
}

export const ERAS: Era[] = [
  {
    id: '1920s',
    name: 'Roaring 20s',
    description: 'Flappers, jazz, and art deco glamour.',
    prompt: 'Transform this person into a 1920s character. Vintage sepia or black and white photography style. Wearing 1920s fashion like a tuxedo or flapper dress. Art deco background, grainy film texture.',
    imagePlaceholder: 'https://picsum.photos/seed/1920s/400/300'
  },
  {
    id: 'vikings',
    name: 'Viking Age',
    description: 'Rugged warriors and Nordic landscapes.',
    prompt: 'Transform this person into a Viking warrior. Wearing fur and leather armor, dramatic lighting, cold nordic landscape background, epic fantasy realism.',
    imagePlaceholder: 'https://picsum.photos/seed/vikings/400/300'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2099',
    description: 'Neon lights, high-tech gear, and future vibes.',
    prompt: 'Transform this person into a cyberpunk character from the year 2099. Neon lighting, futuristic techwear, cybernetic implants, rainy futuristic city background, vibrant colors.',
    imagePlaceholder: 'https://picsum.photos/seed/cyberpunk/400/300'
  },
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and desert sands.',
    prompt: 'Transform this person into an Ancient Egyptian noble. Wearing gold jewelry, linen robes, headdress. Pyramids and desert in background. Warm golden lighting.',
    imagePlaceholder: 'https://picsum.photos/seed/egypt/400/300'
  },
  {
    id: 'victorian',
    name: 'Victorian London',
    description: 'Steam, top hats, and cobblestone streets.',
    prompt: 'Transform this person into a Victorian era gentleman or lady. Steampunk aesthetic elements, top hat or bonnet, foggy London street background, moody atmosphere.',
    imagePlaceholder: 'https://picsum.photos/seed/victorian/400/300'
  },
  {
    id: '80s',
    name: 'Totally 80s',
    description: 'Synthwave, neon, and retro arcade style.',
    prompt: 'Transform this person into a 1980s retro style portrait. Neon lasers in background, synthwave aesthetic, colorful windbreaker or denim jacket, vhs glitch effect.',
    imagePlaceholder: 'https://picsum.photos/seed/80s/400/300'
  }
];