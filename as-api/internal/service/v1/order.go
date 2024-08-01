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

var _ OrderService = &ordersvc{}

type OrderService interface {
	Create(ctx context.Context, order *v1.Order, opts metav1.CreateOptions) error
	Update(ctx context.Context, order *v1.Order, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Order, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.OrderList, error)
}

type ordersvc struct {
	store store.Factory
}

func newOrders(srv *service) *ordersvc {
	return &ordersvc{store: srv.store}
}

func (u *ordersvc) Create(ctx context.Context, order *v1.Order, opts metav1.CreateOptions) error {
	if _, err := u.store.Orders().Get(ctx, int(order.ID), metav1.GetOptions{}); err == nil {
		return errors.WrapCode(fmt.Errorf("order id %d already exist", order.ID), code.ErrOrderAlreadyExist)
	}
	if err := u.store.Orders().Create(ctx, order, opts); err != nil {
		return errors.WithMessage(err, "create order")
	}
	return nil
}

func (u *ordersvc) Update(ctx context.Context, order *v1.Order, opts metav1.UpdateOptions) error {
	if err := u.store.Orders().Update(ctx, order, opts); err != nil {
		return errors.WithMessage(err, "update order")
	}
	return nil
}

func (u *ordersvc) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if err := u.store.Orders().Delete(ctx, id, opts); err != nil {
		return errors.WithMessage(err, "delete order")
	}
	return nil
}

func (u *ordersvc) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Order, error) {
	order, err := u.store.Orders().Get(ctx, id, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "get order")
	}
	return order, nil
}

func (u *ordersvc) List(ctx context.Context, opts metav1.ListOptions) (*v1.OrderList, error) {
	orders, err := u.store.Orders().List(ctx, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "list orders")
	}
	return orders, nil
}
