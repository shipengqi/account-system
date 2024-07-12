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
	// return u.db.Transaction(func(tx *gorm.DB) error {
	// 	err := tx.Create(user).Error
	// 	if err != nil {
	// 		return err
	// 	}
	// 	// do more operations in transaction
	// 	return nil
	// })

	return v.db.Create(vehicle).Error
}

// Update updates a vehicle information.
func (v *vehicles) Update(ctx context.Context, vehicle *v1.Vehicle, opts metav1.UpdateOptions) (err error) {
	return v.db.Where("id = ?", vehicle.ID).Updates(vehicle).Error
}

// Delete deletes a vehicle.
func (v *vehicles) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	vehicle := &v1.Vehicle{}
	err := v.db.Where("id = ?", id).First(&vehicle).Error
	if err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return v.db.Where("id = ?", id).Delete(vehicle).Error
}

// Get returns a vehicle with number.
func (v *vehicles) Get(ctx context.Context, number string, opts metav1.GetOptions) (*v1.Vehicle, error) {
	vehicle := &v1.Vehicle{}
	err := v.db.Where("number = ?", number).First(&vehicle).Error
	if err != nil {
		return nil, err
	}

	return vehicle, nil
}

// List return all vehicles.
func (v *vehicles) List(ctx context.Context, opts metav1.ListOptions) (*v1.VehicleList, error) {
	ret := &v1.VehicleList{}

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
