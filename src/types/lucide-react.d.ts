declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconNode {
    tag: string;
    attr: Record<string, any>;
    children?: IconNode[];
  }

  export interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
  }

  export type Icon = ComponentType<IconProps>;

  export const AlertCircle: Icon;
  export const AlertTriangle: Icon;
  export const ArrowRight: Icon;
  export const Award: Icon;
  export const Bell: Icon;
  export const Briefcase: Icon;
  export const Camera: Icon;
  export const ChevronDown: Icon;
  export const Cloud: Icon;
  export const CloudRain: Icon;
  export const Edit2: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const Facebook: Icon;
  export const FileCheck: Icon;
  export const FileText: Icon;
  export const Filter: Icon;
  export const Globe: Icon;
  export const Home: Icon;
  export const Info: Icon;
  export const Instagram: Icon;
  export const Linkedin: Icon;
  export const Lock: Icon;
  export const LogOut: Icon;
  export const Mail: Icon;
  export const MapPin: Icon;
  export const Menu: Icon;
  export const MessageSquare: Icon;
  export const Mic: Icon;
  export const Moon: Icon;
  export const Pause: Icon;
  export const Phone: Icon;
  export const Play: Icon;
  export const Save: Icon;
  export const Search: Icon;
  export const Settings: Icon;
  export const Shield: Icon;
  export const ShoppingCart: Icon;
  export const Sprout: Icon;
  export const Sun: Icon;
  export const Tag: Icon;
  export const Thermometer: Icon;
  export const Twitter: Icon;
  export const User: Icon;
  export const Users: Icon;
  export const VolumeUp: Icon;
  export const Wind: Icon;
  export const X: Icon;
  export const Zap: Icon;
}