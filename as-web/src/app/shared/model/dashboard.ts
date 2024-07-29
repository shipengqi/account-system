export interface Overall {
  revpay: OverallRevenueAndPayroll;
  exp: OverallGeneral;
  profit: OverallGeneral;
}

export interface OverallRevenueAndPayroll {
  total_revenue: number;
  total_payroll: number;
  cm_revenue: number;
  cm_payroll: number;
  lm_revenue: number;
  lym_revenue: number;
  lm_payroll: number;
  lym_payroll: number;
  mom_revenue?: number;
  m2m_revenue?: number;
  mom_payroll?: number;
  m2m_payroll?: number;
  cm_revenue_categorize?: {
    [key: number]: number;
  };
  cm_vehicle_pay_categorize?: {
    [key: number]: number;
  };
  cm_payroll_categorize?: {
    [key: number]: number;
  }
}

export interface OverallGeneral {
  total: number;
  cm: number;
  lm: number;
  lym: number;
  mom?: number;
  m2m?: number;
  cm_vehicle_total_data?: {
    [key: number]: number;
  };
  cm_categorize?: VehicleCategorizeData
}

export interface VehicleCategorizeData {
  [key: number]: { // type
    total: number;
    vehicle_total_data: {
      [key: number]: number // key: vehicle_id, value: total
    };
  }
}

export interface TimelineExpenditure {
  vehicle_data: {
    [key: number]: number
  };
  bar_data: {
    [key: string]: number
  };
  line_data: {
    [key: string]: {
      [key: number]: number
    }
  };
}

export interface TimelineProfit {
  vehicle_data: {
    [key: number]: number
  };
  bar_data: {
    [key: string]: number
  };
  line_data: {
    [key: string]: {
      [key: number]: number
    }
  };
}

export interface TimelineRevenueAndPayroll {
  vehicle_data: {
    [key: number]: number
  };
  driver_data: {
    [key: number]: number
  };
  revenue_bar_data: {
    [key: string]: number
  };
  payroll_bar_data: {
    [key: string]: number
  };
  revenue_line_data: {
    [key: string]: {
      [key: number]: number
    }
  };
  payroll_line_data: {
    [key: string]: {
      [key: number]: number
    }
  };
}
