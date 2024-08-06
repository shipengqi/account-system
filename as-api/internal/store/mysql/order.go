package mysql

import (
	"bytes"
	"context"
	"fmt"

	"github.com/shipengqi/errors"
	"gorm.io/gorm"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/util/gormutil"
	"github.com/shipengqi/asapi/pkg/util/timeutil"
)

const (
	MOMMonthCursor     = -12
	M2MMonthCursor     = -1
	CurrentMonthCursor = 0
)

type orders struct {
	db *gorm.DB
}

func newOrders(ds *datastore) *orders {
	return &orders{ds.db}
}

// Create creates a new order.
func (v *orders) Create(ctx context.Context, order *v1.Order, opts metav1.CreateOptions) error {
	if err := v.db.Create(order).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Update updates an order information.
func (v *orders) Update(ctx context.Context, order *v1.Order, opts metav1.UpdateOptions) (err error) {
	if err = v.db.Where("id = ?", order.ID).Updates(order).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return
}

// Delete deletes an order.
func (v *orders) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	order := &v1.Order{}
	if err := v.db.Where("id = ?", id).First(&order).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	if err := v.db.Where("id = ?", id).Delete(order).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Get returns an order.
func (v *orders) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Order, error) {
	order := &v1.Order{}
	if err := v.db.Where("id = ?", id).First(&order).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}

	return order, nil
}

// List return all orders.
func (v *orders) List(ctx context.Context, opts metav1.ListOptions) (*v1.OrderList, error) {
	ret := &v1.OrderList{Items: make([]*v1.Order, 0)}

	// Todo order, selector, add status option
	ol := gormutil.DePointer(opts.Offset, opts.Limit)
	sqlstr := OrderListSql(ol.Offset, ol.Limit, opts.Extend, opts.Order)
	if err := v.db.Raw(sqlstr).Scan(&ret.Items).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}

	var total int64
	// err = v.db.Model(&v1.Expenditure{}).Count(&total).Error
	totalsql := OrderTotalSql(opts.Extend)
	if err := v.db.Raw(totalsql).Scan(&total).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}

	ret.Total = total
	return ret, nil
}

func (v *orders) OverallRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error) {
	items := make([]*v1.Order, 0)
	if err := v.db.Raw("select as_order.freight, as_order.payroll from as_order order by id").Scan(&items).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}
	return items, nil
}

func (v *orders) TimelineRevenueAndPayroll(ctx context.Context, vehicles, drivers, timeline []string) ([]*v1.Order, error) {
	items := make([]*v1.Order, 0)
	sql := timelineRevenueAndPayrollSql(vehicles, drivers, timeline)
	if err := v.db.Raw(sql).Scan(&items).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}
	return items, nil
}

// CMRevenueAndPayroll 本月数据
func (v *orders) CMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error) {
	m := make([]*v1.Order, 0)

	if err := v.db.Raw(revenueAndPayrollWithDateSql(CurrentMonthCursor)).Scan(&m).Error; err != nil {
		return m, errors.WrapCode(err, code.ErrDatabase)
	}
	return m, nil
}

// LYMRevenueAndPayroll 去年同月数据
func (v *orders) LYMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error) {
	lastm := make([]*v1.Order, 0)

	if err := v.db.Raw(revenueAndPayrollWithDateSql(MOMMonthCursor)).Scan(&lastm).Error; err != nil {
		return lastm, errors.WrapCode(err, code.ErrDatabase)
	}
	return lastm, nil
}

// LMRevenueAndPayroll 上月数据
func (v *orders) LMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error) {
	lastm := make([]*v1.Order, 0)

	if err := v.db.Raw(revenueAndPayrollWithDateSql(M2MMonthCursor)).Scan(&lastm).Error; err != nil {
		return lastm, errors.WrapCode(err, code.ErrDatabase)
	}
	return lastm, nil
}

func timelineRevenueAndPayrollSql(vehicles, drivers, timeline []string) string {
	// default timeline start and end date
	lstart, _ := timeutil.MonthIntervalTimeFromNow(-11)
	_, lend := timeutil.MonthIntervalTimeFromNow(0)
	if len(timeline) > 0 {
		lstart, _ = timeutil.MonthIntervalTimeWithGivenMon(timeline[0])
	}
	if len(timeline) > 1 {
		_, lend = timeutil.MonthIntervalTimeWithGivenMon(timeline[1])
	}
	var buf bytes.Buffer
	buf.WriteString("select freight, payroll, unload_at, vehicle_id, driver_id ")
	buf.WriteString("from as_order where (unload_at >= '")
	buf.WriteString(lstart)
	buf.WriteString("' and ")
	buf.WriteString("unload_at <= '")
	buf.WriteString(lend)
	buf.WriteString("') ")

	if len(vehicles) > 0 {
		// vehicles limit 5
		if len(vehicles) > 5 {
			vehicles = vehicles[:5]
		}
		buf.WriteString(" and vehicle_id in (")
		for i, v := range vehicles {
			buf.WriteString("'")
			buf.WriteString(v)
			buf.WriteString("'")
			if i < len(vehicles)-1 {
				buf.WriteString(",")
			}
		}
		buf.WriteString(") ")
	}

	if len(drivers) > 0 {
		// vehicles limit 5
		if len(drivers) > 5 {
			drivers = drivers[:5]
		}
		buf.WriteString(" and driver_id in (")
		for i, d := range drivers {
			buf.WriteString("'")
			buf.WriteString(d)
			buf.WriteString("'")
			if i < len(drivers)-1 {
				buf.WriteString(",")
			}
		}
		buf.WriteString(")")
	}

	return buf.String()
}

func revenueAndPayrollWithDateSql(mon int) string {
	lstart, lend := timeutil.MonthIntervalTimeFromNow(mon)
	var buf bytes.Buffer
	buf.WriteString("select freight, payroll, vehicle_id, driver_id ")
	buf.WriteString("from as_order where (unload_at >= '")
	buf.WriteString(lstart)
	buf.WriteString("' and ")
	buf.WriteString("unload_at <= '")
	buf.WriteString(lend)
	buf.WriteString("') ")
	return buf.String()
}

// OrderListSql returns order list.
func OrderListSql(offset, limit int, filters map[string]string, order string) string {
	var buf bytes.Buffer
	buf.WriteString("select as_order.id, as_order.vehicle_id, as_order.project_id")
	buf.WriteString(", as_order.driver_id, as_order.unload_at, as_order.load_at")
	buf.WriteString(", as_order.freight, as_order.payroll, as_order.weight, as_order.comment")
	buf.WriteString(", as_order.created_at, as_order.updated_at, as_vehicle.number as vehicle_number")
	buf.WriteString(", as_project.name as project, as_driver.name as driver ")
	buf.WriteString("from as_order ")
	buf.WriteString("left join as_vehicle on as_vehicle.id = as_order.vehicle_id ")
	buf.WriteString("left join as_project on as_project.id = as_order.project_id ")
	buf.WriteString("left join as_driver on as_driver.id = as_order.driver_id ")
	appendOrderFilersSql(&buf, filters)
	if order != "" {
		buf.WriteString("order by unload_at ")
		buf.WriteString(order)
	} else {
		buf.WriteString("order by id desc")
	}
	buf.WriteString(fmt.Sprintf(" limit %d,%d", offset, limit))
	return buf.String()
}

// OrderTotalSql returns expenditure total.
func OrderTotalSql(filters map[string]string) string {
	var buf bytes.Buffer
	buf.WriteString("select count(*)")
	buf.WriteString("from as_order ")
	appendOrderFilersSql(&buf, filters)
	return buf.String()
}

func appendOrderFilersSql(buf *bytes.Buffer, filters map[string]string) {
	var condition int
	if len(filters) > 0 {
		buf.WriteString("where ")
	}
	if pid, ok := filters["project_id"]; ok {
		condition++
		buf.WriteString(" project_id = ")
		buf.WriteString(pid)
		buf.WriteString(" ")
	}
	if vid, ok := filters["vehicle_id"]; ok {
		if condition > 0 {
			buf.WriteString("and ")
		}
		condition++
		buf.WriteString(" vehicle_id = ")
		buf.WriteString(vid)
		buf.WriteString(" ")
	}
	if vid, ok := filters["driver_id"]; ok {
		if condition > 0 {
			buf.WriteString("and ")
		}
		condition++
		buf.WriteString(" driver_id = ")
		buf.WriteString(vid)
		buf.WriteString(" ")
	}
	if start, ok := filters["unload_start"]; ok {
		if condition > 0 {
			buf.WriteString("and ")
		}
		buf.WriteString("(unload_at >= '")
		buf.WriteString(start)
		buf.WriteString("' and ")
		end := filters["unload_end"]
		buf.WriteString("unload_at <= '")
		buf.WriteString(end)
		buf.WriteString("') ")
	}
}
