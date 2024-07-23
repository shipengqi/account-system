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

type expenditures struct {
	db *gorm.DB
}

func newExpenditures(ds *datastore) *expenditures {
	return &expenditures{ds.db}
}

// Create creates a new expenditure.
func (v *expenditures) Create(ctx context.Context, expenditure *v1.Expenditure, opts metav1.CreateOptions) error {
	// return u.db.Transaction(func(tx *gorm.DB) error {
	// 	err := tx.Create(user).Error
	// 	if err != nil {
	// 		return err
	// 	}
	// 	// do more operations in transaction
	// 	return nil
	// })

	return v.db.Create(expenditure).Error
}

// Update updates a expenditure information.
func (v *expenditures) Update(ctx context.Context, expenditure *v1.Expenditure, opts metav1.UpdateOptions) (err error) {
	return v.db.Where("id = ?", expenditure.ID).Updates(expenditure).Error
}

// Delete deletes a expenditure.
func (v *expenditures) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	expenditure := &v1.Expenditure{}
	err := v.db.Where("id = ?", id).First(&expenditure).Error
	if err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return v.db.Where("id = ?", id).Delete(expenditure).Error
}

// Get returns a expenditure.
func (v *expenditures) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Expenditure, error) {
	expenditure := &v1.Expenditure{}
	err := v.db.Where("id = ?", id).First(&expenditure).Error
	if err != nil {
		return nil, err
	}

	return expenditure, nil
}

// List return all expenditures.
func (v *expenditures) List(ctx context.Context, opts metav1.ListOptions) (*v1.ExpenditureList, error) {
	ret := &v1.ExpenditureList{Items: make([]*v1.Expenditure, 0)}

	// Todo order, selector, add status option
	ol := gormutil.DePointer(opts.Offset, opts.Limit)
	sqlstr := ExpenditureListSql(ol.Offset, ol.Limit, opts.Extend)
	err := v.db.Raw(sqlstr).Scan(&ret.Items).Error
	if err != nil {
		return nil, err
	}

	var total int64
	// err = v.db.Model(&v1.Expenditure{}).Count(&total).Error
	totalsql := ExpenditureTotalSql(opts.Extend)
	err = v.db.Raw(totalsql).Scan(&total).Error
	if err != nil {
		return nil, err
	}

	ret.Total = total
	return ret, nil
}

func (v *expenditures) OverallExpenditure(ctx context.Context) ([]*v1.Expenditure, error) {
	items := make([]*v1.Expenditure, 0)
	err := v.db.Raw("select cost from as_expenditure order by id").Scan(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}

func (v *expenditures) TimelineExpenditure(ctx context.Context, vehicles, timeline []string) ([]*v1.Expenditure, error) {
	items := make([]*v1.Expenditure, 0)
	sql := timelineExpenditureSql(vehicles, timeline)
	err := v.db.Raw(sql).Scan(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}

// CMExpenditure 本月数据
func (v *expenditures) CMExpenditure(ctx context.Context) ([]*v1.Expenditure, error) {
	m := make([]*v1.Expenditure, 0)

	err := v.db.Raw(expenditureWithDateSql(CurrentMonthCursor)).Scan(&m).Error
	if err != nil {
		return m, err
	}
	return m, nil
}

// LYMExpenditure 去年同月数据
func (v *expenditures) LYMExpenditure(ctx context.Context) ([]*v1.Expenditure, error) {
	lastm := make([]*v1.Expenditure, 0)

	err := v.db.Raw(expenditureWithDateSql(MOMMonthCursor)).Scan(&lastm).Error
	if err != nil {
		return lastm, err
	}
	return lastm, nil
}

// LMExpenditure 上月数据
func (v *expenditures) LMExpenditure(ctx context.Context) ([]*v1.Expenditure, error) {
	lastm := make([]*v1.Expenditure, 0)

	err := v.db.Raw(expenditureWithDateSql(M2MMonthCursor)).Scan(&lastm).Error
	if err != nil {
		return lastm, err
	}
	return lastm, nil
}

func timelineExpenditureSql(vehicles, timeline []string) string {
	// default timeline start and end date
	lstart, _ := timeutil.MonthIntervalTimeFromNow(-11)
	_, lend := timeutil.MonthIntervalTimeFromNow(0)
	if len(timeline) > 0 {
		lstart, _ = timeutil.MonthIntervalTimeWithGivenDate(timeline[0])
	}
	if len(timeline) > 1 {
		_, lend = timeutil.MonthIntervalTimeWithGivenDate(timeline[0])
	}
	var buf bytes.Buffer
	buf.WriteString("select type, cost, expend_at, vehicle_id ")
	buf.WriteString("from as_expenditure where (expend_at >= '")
	buf.WriteString(lstart)
	buf.WriteString("' and ")
	buf.WriteString("expend_at <= '")
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
		buf.WriteString(")")
	}

	return buf.String()
}

func expenditureWithDateSql(mon int) string {
	lstart, lend := timeutil.MonthIntervalTimeFromNow(mon)
	var buf bytes.Buffer
	buf.WriteString("select cost ")
	buf.WriteString("from as_expenditure where (expend_at >= '")
	buf.WriteString(lstart)
	buf.WriteString("' and ")
	buf.WriteString("expend_at <= '")
	buf.WriteString(lend)
	buf.WriteString("') ")
	return buf.String()
}

// ExpenditureListSql returns expenditure list.
func ExpenditureListSql(offset, limit int, filters map[string]string) string {
	var buf bytes.Buffer
	buf.WriteString("select as_expenditure.id, as_expenditure.type, as_expenditure.cost")
	buf.WriteString(", as_expenditure.vehicle_id, as_expenditure.expend_at, as_expenditure.comment")
	buf.WriteString(", as_expenditure.created_at, as_expenditure.updated_at, as_vehicle.number as vehicle_number ")
	buf.WriteString("from as_expenditure ")
	buf.WriteString("left join as_vehicle on as_vehicle.id = as_expenditure.vehicle_id ")
	appendExpendFilersSql(&buf, filters)
	buf.WriteString("order by id desc")
	buf.WriteString(fmt.Sprintf(" limit %d,%d", offset, limit))
	return buf.String()
}

// ExpenditureTotalSql returns expenditure total.
func ExpenditureTotalSql(filters map[string]string) string {
	var buf bytes.Buffer
	buf.WriteString("select count(*)")
	buf.WriteString("from as_expenditure ")
	appendExpendFilersSql(&buf, filters)
	return buf.String()
}

func appendExpendFilersSql(buf *bytes.Buffer, filters map[string]string) {
	var condition int
	if len(filters) > 0 {
		buf.WriteString("where ")
	}
	if ty, ok := filters["type"]; ok {
		condition++
		buf.WriteString(" type = ")
		buf.WriteString(ty)
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
	if start, ok := filters["expend_start"]; ok {
		if condition > 0 {
			buf.WriteString("and ")
		}
		buf.WriteString("(expend_at >= '")
		buf.WriteString(start)
		buf.WriteString("' and ")
		end := filters["expend_end"]
		buf.WriteString("expend_at <= '")
		buf.WriteString(end)
		buf.WriteString("') ")
	}
}
