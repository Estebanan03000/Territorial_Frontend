export interface Commune {
  id_commune?: number;
  id_city?: number;
  name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunePayload {
  id_city: number;
  name: string;
  status: string;
}

export interface CommuneFilters {
  q?: string;
  id_department?: number;
  id_city?: number;
  status?: string;
}