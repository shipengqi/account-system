package v1

type OverallRevenueAndPayroll struct {
	TotalRevenue int `json:"total_revenue"`
	TotalPayroll int `json:"total_payroll"`
	CMRevenue    int `json:"cm_revenue"`
	CMPayroll    int `json:"cm_payroll"`
	LMRevenue    int `json:"lm_revenue"`
	LYMRevenue   int `json:"lym_revenue"`
	LMPayroll    int `json:"lm_payroll"`
	LYMPayroll   int `json:"lym_payroll"`
}

type OverallExpenditure struct {
	Total int `json:"total"`
	CM    int `json:"cm"`
	LM    int `json:"lm"`
	LYM   int `json:"lym"`
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
	VehicleData map[int]int            `json:"vehicle_data"`
	BarData     map[string]int         `json:"bar_data"`
	LineData    map[string]map[int]int `json:"line_data"`
}

type TimelineProfit TimelineExpenditure
