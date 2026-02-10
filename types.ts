export interface Task {
  title: string;
  description: string;
}

export interface Competition {
  day: number;
  title: string;
  link: string;
  description?: string;
  tasks: Task[];
}

export interface Week {
  id: number;
  title: string;
  subtitle: string;
  competitions: Competition[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  weeks: Week[];
}

export interface TicketSection {
  title: string;
  items: string[];
}

export interface Ticket {
  id: number;
  title: string;
  theory: TicketSection[];
  code: TicketSection[];
}