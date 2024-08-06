export interface IDriver {
  id: number;
  name: string;
  phone: string;
  address: string;
  status: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface IVehicle {
  id: number;
  number: string;
  brand: string;
  status: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface IProject {
  id: number;
  name: string;
  start_at: string;
  end_at: string;
  status: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface IExpenditure {
  id: number;
  type: number;
  cost: number;
  expend_at: string;
  vehicle_number: string;
  vehicle_id: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenditureSearchData {
  type: number;
  expend_range: string[];
  vehicle_id: number;
  expend_at_order?: string;
}
