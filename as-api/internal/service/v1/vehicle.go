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

var _ VehicleService = &vehiclesvc{}

// VehicleService defines functions used to handle user request.
type VehicleService interface {
	Create(ctx context.Context, vehicle *v1.Vehicle, opts metav1.CreateOptions) error
	Update(ctx context.Context, vehicle *v1.Vehicle, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, number string, opts metav1.GetOptions) (*v1.Vehicle, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.VehicleList, error)
}

type vehiclesvc struct {
	store store.Factory
}

func newVehicles(srv *service) *vehiclesvc {
	return &vehiclesvc{store: srv.store}
}

func (u *vehiclesvc) Create(ctx context.Context, vehicle *v1.Vehicle, opts metav1.CreateOptions) error {
	if _, err := u.store.Vehicles().Get(ctx, vehicle.Number, metav1.GetOptions{}); err == nil {
		return errors.WrapCode(fmt.Errorf("vehicle number %s already exist", vehicle.Number), code.ErrVehicleAlreadyExist)
	}
	if err := u.store.Vehicles().Create(ctx, vehicle, opts); err != nil {
		return errors.WithMessage(err, "create vehicle")
	}
	return nil
}

func (u *vehiclesvc) Update(ctx context.Context, vehicle *v1.Vehicle, opts metav1.UpdateOptions) error {
	if err := u.store.Vehicles().Update(ctx, vehicle, opts); err != nil {
		return errors.WithMessage(err, "update vehicle")
	}
	return nil
}

func (u *vehiclesvc) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if err := u.store.Vehicles().Delete(ctx, id, opts); err != nil {
		return errors.WithMessage(err, "delete vehicle")
	}
	return nil
}

func (u *vehiclesvc) Get(ctx context.Context, number string, opts metav1.GetOptions) (*v1.Vehicle, error) {
	vehicle, err := u.store.Vehicles().Get(ctx, number, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "get vehicle")
	}
	return vehicle, nil
}

func (u *vehiclesvc) List(ctx context.Context, opts metav1.ListOptions) (*v1.VehicleList, error) {
	vehicles, err := u.store.Vehicles().List(ctx, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "list vehicles")
	}
	return vehicles, nil
}
