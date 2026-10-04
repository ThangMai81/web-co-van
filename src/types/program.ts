export type ProgramCategory =
  | "trai-he"
  | "leo-nui"
  | "workshop"
  | "off-chua-lanh";
export type ProgramStatus = "upcoming" | "past";

export type ProgramSort = "newest" | "price-asc" | "price-desc";

export interface ProgramStat {
  label: string;
  value: string;
}

export interface ProgramRegistration {
  isOpen: boolean;
  price?: number;
  seatsTotal?: number;
  seatsTaken?: number;
  deadline?: string;
  contactPhone?: string;
}

export interface Program {
  _id: string;
  title: string;
  slug: string;
  category: ProgramCategory;
  status: ProgramStatus;
  format: "online" | "offline";
  location?: string;
  schedule: string;
  theme?: string;
  description: string;
  highlights: string[];
  coverImage?: string;
  videoUrl?: string;
  gallery: string[];
  stats: ProgramStat[];
  registration?: ProgramRegistration;
  featured: boolean;
}
