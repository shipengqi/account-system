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
	ret := &v1.ExpenditureList{}

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
