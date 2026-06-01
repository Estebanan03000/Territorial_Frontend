export interface Citizen {
  id_citizen?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}
