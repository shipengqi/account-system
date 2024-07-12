package mysql

import (
	"context"

	"github.com/shipengqi/errors"
	"gorm.io/gorm"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/util/gormutil"
)

type orders struct {
	db *gorm.DB
}

func newOrders(ds *datastore) *orders {
	return &orders{ds.db}
}

// Create creates a new order.
func (v *orders) Create(ctx context.Context, order *v1.Order, opts metav1.CreateOptions) error {
	// return u.db.Transaction(func(tx *gorm.DB) error {
	// 	err := tx.Create(user).Error
	// 	if err != nil {
	// 		return err
	// 	}
	// 	// do more operations in transaction
	// 	return nil
	// })

	return v.db.Create(order).Error
}

// Update updates an order information.
func (v *orders) Update(ctx context.Context, order *v1.Order, opts metav1.UpdateOptions) (err error) {
	return v.db.Where("id = ?", order.ID).Updates(order).Error
}

// Delete deletes an order.
func (v *orders) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	order := &v1.Order{}
	err := v.db.Where("id = ?", id).First(&order).Error
	if err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return v.db.Where("id = ?", id).Delete(order).Error
}

// Get returns an order.
func (v *orders) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Order, error) {
	order := &v1.Order{}
	err := v.db.Where("id = ?", id).First(&order).Error
	if err != nil {
		return nil, err
	}

	return order, nil
}

// List return all orders.
func (v *orders) List(ctx context.Context, opts metav1.ListOptions) (*v1.OrderList, error) {
	ret := &v1.OrderList{}

	// Todo order, selector, add status option
	ol := gormutil.DePointer(opts.Offset, opts.Limit)
	d := v.db.
		Offset(ol.Offset).
		Limit(ol.Limit).
		Order("id desc").
		Find(&ret.Items).
		Offset(-1).
		Limit(-1).
		Count(&ret.Total)

	return ret, d.Error
}
