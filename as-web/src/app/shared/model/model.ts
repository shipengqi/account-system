export interface IDriver {
  id: number;
  name: string;
  phone: string;
  address: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IVehicle {
  id: number;
  number: string;
  brand: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IProject {
  id: number;
  name: string;
  start_at: string;
  end_at: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IExpenditure {
  id: number;
  type: number;
  cost: number;
  expend_at: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}
