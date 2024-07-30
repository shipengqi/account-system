package v1

type OverallRevenueAndPayroll struct {
	TotalRevenue         int         `json:"total_revenue"`
	TotalPayroll         int         `json:"total_payroll"`
	CMRevenue            int         `json:"cm_revenue"`
	CMPayroll            int         `json:"cm_payroll"`
	LMRevenue            int         `json:"lm_revenue"`
	LYMRevenue           int         `json:"lym_revenue"`
	LMPayroll            int         `json:"lm_payroll"`
	LYMPayroll           int         `json:"lym_payroll"`
	CMRevenueCategorize  map[int]int `json:"cm_revenue_categorize"`
	CMPayrollCategorize  map[int]int `json:"cm_payroll_categorize"`
	CMVPayrollCategorize map[int]int `json:"cm_vehicle_pay_categorize"`
}

type OverallExpenditure struct {
	Total              float32                   `json:"total"`
	CM                 float32                   `json:"cm"`
	LM                 float32                   `json:"lm"`
	LYM                float32                   `json:"lym"`
	CMVehicleTotalData map[int]float32           `json:"cm_vehicle_total_data"`
	CMCategorize       map[int]*CMCategorizeData `json:"cm_categorize"`
}

type CMCategorizeData struct {
	Total            float32         `json:"total"`
	VehicleTotalData map[int]float32 `json:"vehicle_total_data"`
}

type TimelineRevenueAndPayroll struct {
	VehicleData     map[int]int            `json:"vehicle_data"`
	DriverData      map[int]int            `json:"driver_data"`
	RevenueBarData  map[string]int         `json:"revenue_bar_data"`
	PayrollBarData  map[string]int         `json:"payroll_bar_data"`
	RevenueLineData map[string]map[int]int `json:"revenue_line_data"`
	PayrollLineData map[string]map[int]int `json:"payroll_line_data"`
}

type TimelineExpenditure struct {
	VehicleData map[int]float32            `json:"vehicle_data"`
	BarData     map[string]float32         `json:"bar_data"`
	LineData    map[string]map[int]float32 `json:"line_data"`
}

type TimelineProfit TimelineExpenditure
