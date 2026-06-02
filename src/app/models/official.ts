export interface Official {
  id_official?: number;
  id_entity?: number;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  status?: string;
  last_latitude?: number | null;
  last_longitude?: number | null;
  last_gps_update?: string | null;
  gps_active?: boolean;
}

export interface OfficialPayload {
  id_entity: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  gps_active: boolean;
}

export interface OfficialFilters {
  q?: string;
  id_entity?: number;
  status?: string;
}

export interface OfficialTrackingRequest {
  ids: number[];
}

export interface OfficialTrackingStartResponse {
  started_ids: number[];
  ignored: {
    missing: number[];
    inactive: number[];
    missing_coords: number[];
    invalid: any[];
  };
}

export interface OfficialTrackingStopResponse {
  stopped_ids: number[];
  not_tracking: number[];
  invalid: any[];
  stopped_all: boolean;
}