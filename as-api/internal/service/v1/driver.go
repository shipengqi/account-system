package v1

import (
	"context"
	"fmt"

	"github.com/shipengqi/asapi/internal/store"
	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/errors"
)

var _ DriverService = &driversvc{}

type DriverService interface {
	Create(ctx context.Context, driver *v1.Driver, opts metav1.CreateOptions) error
	Update(ctx context.Context, driver *v1.Driver, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Driver, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.DriverList, error)
}

type driversvc struct {
	store store.Factory
}

func newDrivers(srv *service) *driversvc {
	return &driversvc{store: srv.store}
}

func (u *driversvc) Create(ctx context.Context, driver *v1.Driver, opts metav1.CreateOptions) error {
	if _, err := u.store.Drivers().Get(ctx, int(driver.ID), metav1.GetOptions{}); err == nil {
		return errors.WrapCode(fmt.Errorf("driver id %d already exist", driver.ID), code.ErrDriverAlreadyExist)
	}
	if err := u.store.Drivers().Create(ctx, driver, opts); err != nil {
		return errors.WithMessage(err, "create driver")
	}
	return nil
}

func (u *driversvc) Update(ctx context.Context, driver *v1.Driver, opts metav1.UpdateOptions) error {
	if err := u.store.Drivers().Update(ctx, driver, opts); err != nil {
		return errors.WithMessage(err, "update driver")
	}
	return nil
}

func (u *driversvc) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if err := u.store.Drivers().Delete(ctx, id, opts); err != nil {
		return errors.WithMessage(err, "delete driver")
	}
	return nil
}

func (u *driversvc) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Driver, error) {
	driver, err := u.store.Drivers().Get(ctx, id, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "get driver")
	}
	return driver, nil
}

func (u *driversvc) List(ctx context.Context, opts metav1.ListOptions) (*v1.DriverList, error) {
	drivers, err := u.store.Drivers().List(ctx, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "list drivers")
	}
	return drivers, nil
}
