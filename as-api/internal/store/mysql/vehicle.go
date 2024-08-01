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

type vehicles struct {
	db *gorm.DB
}

func newVehicles(ds *datastore) *vehicles {
	return &vehicles{ds.db}
}

// Create creates a new vehicle.
func (v *vehicles) Create(ctx context.Context, vehicle *v1.Vehicle, opts metav1.CreateOptions) error {
	if err := v.db.Create(vehicle).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Update updates a vehicle information.
func (v *vehicles) Update(ctx context.Context, vehicle *v1.Vehicle, opts metav1.UpdateOptions) (err error) {
	if err = v.db.Where("id = ?", vehicle.ID).Updates(vehicle).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return
}

// Delete deletes a vehicle.
func (v *vehicles) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	vehicle := &v1.Vehicle{}
	if err := v.db.Where("id = ?", id).First(&vehicle).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	if err := v.db.Where("id = ?", id).Delete(vehicle).Error; err != nil {
		return errors.WrapCode(err, code.ErrDatabase)
	}
	return nil
}

// Get returns a vehicle with number.
func (v *vehicles) Get(ctx context.Context, number string, opts metav1.GetOptions) (*v1.Vehicle, error) {
	vehicle := &v1.Vehicle{}
	if err := v.db.Where("number = ?", number).First(&vehicle).Error; err != nil {
		return nil, errors.WrapCode(err, code.ErrDatabase)
	}

	return vehicle, nil
}

// List return all vehicles.
func (v *vehicles) List(ctx context.Context, opts metav1.ListOptions) (*v1.VehicleList, error) {
	ret := &v1.VehicleList{Items: make([]*v1.Vehicle, 0)}

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
