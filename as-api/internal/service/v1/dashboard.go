package v1

import (
	"context"
	"fmt"
	"time"

	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/internal/store"
	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	"github.com/shipengqi/asapi/pkg/code"
)

var _ DashboardService = &dashboardsvc{}

type DashboardService interface {
	OverallRevenueAndPayroll(ctx context.Context) (*v1.OverallRevenueAndPayroll, error)
	OverallExpenditure(ctx context.Context) (*v1.OverallExpenditure, error)
	TimelineRevenueAndPayroll(ctx context.Context, vehicles, timeline []string) (*v1.TimelineRevenueAndPayroll, error)
	TimelineExpenditure(ctx context.Context, vehicles, timeline []string) (*v1.TimelineExpenditure, error)
	TimelineProfit(ctx context.Context, vehicles, timeline []string) (*v1.TimelineProfit, error)
}

type dashboardsvc struct {
	store store.Factory
}

func newDashboard(srv *service) *dashboardsvc {
	return &dashboardsvc{store: srv.store}
}

func (u *dashboardsvc) OverallExpenditure(ctx context.Context) (*v1.OverallExpenditure, error) {
	exs, err := u.store.Expenditures().OverallExpenditure(ctx)
	if err != nil {
		log.Errorf("get overall expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	costTotal := calculateExpenditureTotal(exs)

	cm, err := u.store.Expenditures().CMExpenditure(ctx)
	if err != nil {
		log.Errorf("get current month expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	lm, err := u.store.Expenditures().LMExpenditure(ctx)
	if err != nil {
		log.Errorf("get last month expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	lym, err := u.store.Expenditures().LYMExpenditure(ctx)
	if err != nil {
		log.Errorf("get last year month expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	cmTotal := calculateExpenditureTotal(cm)
	lmTotal := calculateExpenditureTotal(lm)
	lymTotal := calculateExpenditureTotal(lym)

	return &v1.OverallExpenditure{
		Total: costTotal,
		CM:    cmTotal,
		LM:    lmTotal,
		LYM:   lymTotal,
	}, nil
}

func (u *dashboardsvc) OverallRevenueAndPayroll(ctx context.Context) (*v1.OverallRevenueAndPayroll, error) {
	// month-to-month 月环比
	// month-on-month 月同比
	orders, err := u.store.Orders().OverallRevenueAndPayroll(ctx)
	if err != nil {
		log.Errorf("get overall revenue and payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	freightTotal, payrollTotal := calculateRevenueAndPayrollTotal(orders)

	cm, err := u.store.Orders().CMRevenueAndPayroll(ctx)
	if err != nil {
		log.Errorf("get current m revenue and payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	cmFreightTotal, cmPayrollTotal := calculateRevenueAndPayrollTotal(cm)

	lm, err := u.store.Orders().LMRevenueAndPayroll(ctx)
	if err != nil {
		log.Errorf("get last month revenue and payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	lmFreightTotal, lmPayrollTotal := calculateRevenueAndPayrollTotal(lm)

	lym, err := u.store.Orders().LYMRevenueAndPayroll(ctx)
	if err != nil {
		log.Errorf("get mom revenue and payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	lymFreightTotal, lymPayrollTotal := calculateRevenueAndPayrollTotal(lym)

	res := &v1.OverallRevenueAndPayroll{
		TotalRevenue: freightTotal,
		TotalPayroll: payrollTotal,
		CMRevenue:    cmFreightTotal,
		CMPayroll:    cmPayrollTotal,
		LMRevenue:    lmFreightTotal,
		LMPayroll:    lmPayrollTotal,
		LYMRevenue:   lymFreightTotal,
		LYMPayroll:   lymPayrollTotal,
	}
	return res, nil
}

func (u *dashboardsvc) TimelineRevenueAndPayroll(ctx context.Context, vehicles, timeline []string) (*v1.TimelineRevenueAndPayroll, error) {
	revpay, err := u.store.Orders().TimelineRevenueAndPayroll(ctx, vehicles, timeline)
	if err != nil {
		log.Errorf("get timeline revenue and payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}

	vehicleIdsMap := make(map[int]int)
	driverIdsMap := make(map[int]int)
	revenueBarMap := make(map[string]int)
	revenueLineMap := make(map[string]map[int]int)
	payrollBarMap := make(map[string]int)
	payrollLineMap := make(map[string]map[int]int)

	for _, e := range revpay {
		if _, ok := vehicleIdsMap[int(e.VehicleID)]; !ok {
			vehicleIdsMap[int(e.VehicleID)] = 0
		}
		vehicleIdsMap[int(e.VehicleID)] += e.Freight

		if _, ok := driverIdsMap[int(e.DriverID)]; !ok {
			driverIdsMap[int(e.DriverID)] = 0
		}
		driverIdsMap[int(e.DriverID)] += e.Payroll

		conv, _ := time.ParseInLocation(time.RFC3339, e.UnLoadAt, time.Local)
		year, month, _ := conv.Date()
		timestr := fmt.Sprintf("%d/%d", year, month)
		if _, ok := revenueBarMap[timestr]; !ok {
			revenueBarMap[timestr] = 0
		}
		revenueBarMap[timestr] += e.Freight
		if _, ok := payrollBarMap[timestr]; !ok {
			payrollBarMap[timestr] = 0
		}
		payrollBarMap[timestr] += e.Payroll

		if _, ok := revenueLineMap[timestr]; !ok {
			revenueLineMap[timestr] = make(map[int]int)
		}
		if _, ok := revenueLineMap[timestr][int(e.VehicleID)]; !ok {
			revenueLineMap[timestr][int(e.VehicleID)] = 0
		}
		revenueLineMap[timestr][int(e.VehicleID)] += e.Freight

		if _, ok := payrollLineMap[timestr]; !ok {
			payrollLineMap[timestr] = make(map[int]int)
		}
		if _, ok := payrollLineMap[timestr][int(e.DriverID)]; !ok {
			payrollLineMap[timestr][int(e.DriverID)] = 0
		}
		payrollLineMap[timestr][int(e.DriverID)] += e.Payroll
	}
	tr := &v1.TimelineRevenueAndPayroll{
		VehicleData:     vehicleIdsMap,
		DriverData:      driverIdsMap,
		RevenueBarData:  revenueBarMap,
		PayrollBarData:  payrollBarMap,
		RevenueLineData: revenueLineMap,
		PayrollLineData: payrollLineMap,
	}
	return tr, nil
}

func (u *dashboardsvc) TimelineExpenditure(ctx context.Context, vehicles, timeline []string) (*v1.TimelineExpenditure, error) {
	te := &v1.TimelineExpenditure{}
	exps, err := u.store.Expenditures().TimelineExpenditure(ctx, vehicles, timeline)
	if err != nil {
		log.Errorf("get timeline expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	vehicleIdsMap := make(map[int]int)
	timeBarMap := make(map[string]int)
	timelineMap := make(map[string]map[int]int)
	for _, e := range exps {
		if _, ok := vehicleIdsMap[int(e.VehicleID)]; !ok {
			vehicleIdsMap[int(e.VehicleID)] = 0
		}
		vehicleIdsMap[int(e.VehicleID)] += e.Cost
		// fix issue: https://www.xuboso.com/blogs/55/golang-mysql-datetime-format
		conv, _ := time.ParseInLocation(time.RFC3339, e.ExpendAt, time.Local)
		year, month, _ := conv.Date()
		timestr := fmt.Sprintf("%d/%d", year, month)
		if _, ok := timeBarMap[timestr]; !ok {
			timeBarMap[timestr] = 0
		}
		timeBarMap[timestr] += e.Cost

		if _, ok := timelineMap[timestr]; !ok {
			timelineMap[timestr] = make(map[int]int)
		}
		if _, ok := timelineMap[timestr][int(e.VehicleID)]; !ok {
			timelineMap[timestr][int(e.VehicleID)] = 0
		}
		timelineMap[timestr][int(e.VehicleID)] += e.Cost
	}
	te.VehicleData = vehicleIdsMap
	te.BarData = timeBarMap
	te.LineData = timelineMap

	return te, nil
}

func (u *dashboardsvc) TimelineProfit(ctx context.Context, vehicles, timeline []string) (*v1.TimelineProfit, error) {
	revpay, err := u.store.Orders().TimelineRevenueAndPayroll(ctx, vehicles, timeline)
	if err != nil {
		log.Errorf("get timeline profit.revenue and profit.payroll from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}
	exps, err := u.store.Expenditures().TimelineExpenditure(ctx, vehicles, timeline)
	if err != nil {
		log.Errorf("get timeline profit.expenditure from storage failed: %s", err.Error())
		return nil, errors.WithCode(err, code.ErrDatabase)
	}

	vehicleRevenueMap := make(map[int]int)
	vehicleExpenditureMap := make(map[int]int)
	vehicleProfitMap := make(map[int]int)

	vehicleRevenueBarMap := make(map[string]int)
	vehicleExpenditureBarMap := make(map[string]int)
	vehicleProfitBarMap := make(map[string]int)

	vehicleRevenueLineMap := make(map[string]map[int]int)
	vehicleExpenditureLineMap := make(map[string]map[int]int)
	vehicleProfitLineMap := make(map[string]map[int]int)

	for _, e := range revpay {
		if _, ok := vehicleRevenueMap[int(e.VehicleID)]; !ok {
			vehicleRevenueMap[int(e.VehicleID)] = 0
		}
		vehicleRevenueMap[int(e.VehicleID)] += e.Freight - e.Payroll

		conv, _ := time.ParseInLocation(time.RFC3339, e.UnLoadAt, time.Local)
		year, month, _ := conv.Date()
		timestr := fmt.Sprintf("%d/%d", year, month)

		if _, ok := vehicleRevenueBarMap[timestr]; !ok {
			vehicleRevenueBarMap[timestr] = 0
		}
		vehicleRevenueBarMap[timestr] += e.Freight - e.Payroll

		if _, ok := vehicleRevenueLineMap[timestr]; !ok {
			vehicleRevenueLineMap[timestr] = make(map[int]int)
		}
		if _, ok := vehicleRevenueLineMap[timestr][int(e.VehicleID)]; !ok {
			vehicleRevenueLineMap[timestr][int(e.VehicleID)] = 0
		}
		vehicleRevenueLineMap[timestr][int(e.VehicleID)] += e.Freight - e.Payroll
	}
	for _, e := range exps {
		if _, ok := vehicleExpenditureMap[int(e.VehicleID)]; !ok {
			vehicleExpenditureMap[int(e.VehicleID)] = 0
		}
		vehicleExpenditureMap[int(e.VehicleID)] += e.Cost

		conv, _ := time.ParseInLocation(time.RFC3339, e.ExpendAt, time.Local)
		year, month, _ := conv.Date()
		timestr := fmt.Sprintf("%d/%d", year, month)

		if _, ok := vehicleExpenditureBarMap[timestr]; !ok {
			vehicleExpenditureBarMap[timestr] = 0
		}
		vehicleExpenditureBarMap[timestr] += e.Cost

		if _, ok := vehicleExpenditureLineMap[timestr]; !ok {
			vehicleExpenditureLineMap[timestr] = make(map[int]int)
		}
		if _, ok := vehicleExpenditureLineMap[timestr][int(e.VehicleID)]; !ok {
			vehicleExpenditureLineMap[timestr][int(e.VehicleID)] = 0
		}
		vehicleExpenditureLineMap[timestr][int(e.VehicleID)] += e.Cost
	}
	for vid, revenue := range vehicleRevenueMap {
		vehicleProfitMap[vid] = revenue - vehicleExpenditureMap[vid]
	}
	for timestr, revenue := range vehicleRevenueBarMap {
		vehicleProfitBarMap[timestr] = revenue - vehicleExpenditureBarMap[timestr]
	}
	for timestr, vdata := range vehicleRevenueLineMap {
		if _, ok := vehicleProfitLineMap[timestr]; !ok {
			vehicleProfitLineMap[timestr] = make(map[int]int)
		}
		for vid, revenue := range vdata {
			vehicleProfitLineMap[timestr][vid] = revenue - vehicleExpenditureLineMap[timestr][vid]
		}
	}

	return &v1.TimelineProfit{
		VehicleData: vehicleProfitMap,
		BarData:     vehicleProfitBarMap,
		LineData:    vehicleProfitLineMap,
	}, nil
}

// calculateRevenueAndPayrollTotal 计算数据总值
func calculateRevenueAndPayrollTotal(mdata []*v1.Order) (freight, payroll int) {
	for _, v := range mdata {
		payroll = payroll + v.Payroll
		freight = freight + v.Freight
	}
	return freight, payroll
}

// calculateExpenditureTotal 计算数据总值
func calculateExpenditureTotal(mdata []*v1.Expenditure) (cost int) {
	for _, v := range mdata {
		cost = cost + v.Cost
	}
	return cost
}
