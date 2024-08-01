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
	if err := v.db.Create(driver).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Update updates a driver information.
func (v *drivers) Update(ctx context.Context, driver *v1.Driver, opts metav1.UpdateOptions) (err error) {
	if err = v.db.Where("id = ?", driver.ID).Updates(driver).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return
}

// Delete deletes a driver.
func (v *drivers) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	driver := &v1.Driver{}
	if err := v.db.Where("id = ?", id).First(&driver).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	if err := v.db.Where("id = ?", id).Delete(driver).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Get returns a driver.
func (v *drivers) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Driver, error) {
	driver := &v1.Driver{}
	if err := v.db.Where("id = ?", id).First(&driver).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}

	return driver, nil
}

// List return all drivers.
func (v *drivers) List(ctx context.Context, opts metav1.ListOptions) (*v1.DriverList, error) {
	ret := &v1.DriverList{Items: make([]*v1.Driver, 0)}

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

	if d.Error != nil {
		return nil, errors.WrapCode(d.Error, code.ErrDatabase)
	}
	return ret, nil
}
