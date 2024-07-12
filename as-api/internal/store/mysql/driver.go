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

type drivers struct {
	db *gorm.DB
}

func newDrivers(ds *datastore) *drivers {
	return &drivers{ds.db}
}

// Create creates a new driver.
func (v *drivers) Create(ctx context.Context, driver *v1.Driver, opts metav1.CreateOptions) error {
	// return u.db.Transaction(func(tx *gorm.DB) error {
	// 	err := tx.Create(user).Error
	// 	if err != nil {
	// 		return err
	// 	}
	// 	// do more operations in transaction
	// 	return nil
	// })

	return v.db.Create(driver).Error
}

// Update updates a driver information.
func (v *drivers) Update(ctx context.Context, driver *v1.Driver, opts metav1.UpdateOptions) (err error) {
	return v.db.Where("id = ?", driver.ID).Updates(driver).Error
}

// Delete deletes a driver.
func (v *drivers) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	driver := &v1.Driver{}
	err := v.db.Where("id = ?", id).First(&driver).Error
	if err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return v.db.Where("id = ?", id).Delete(driver).Error
}

// Get returns a driver.
func (v *drivers) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Driver, error) {
	driver := &v1.Driver{}
	err := v.db.Where("id = ?", id).First(&driver).Error
	if err != nil {
		return nil, err
	}

	return driver, nil
}

// List return all drivers.
func (v *drivers) List(ctx context.Context, opts metav1.ListOptions) (*v1.DriverList, error) {
	ret := &v1.DriverList{}

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
