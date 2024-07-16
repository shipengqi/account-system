export interface IOrder {
  id: number;
  project_id: number;
  vehicle_id: number;
  driver_id: number;
  status: number;
  project: string;
  vehicle_number: string;
  driver: string;
  load_at: string;
  unload_at: string;
  mileage: number;
  freight: number;
  payroll: number;
  weight: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderSearchData {
  unload_range: string[];
  vehicle_id: number;
  project_id: number;
  driver_id: number;
}
