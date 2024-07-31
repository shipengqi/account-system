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

var _ ExpenditureService = &expendituresvc{}

type ExpenditureService interface {
	Create(ctx context.Context, expenditure *v1.Expenditure, opts metav1.CreateOptions) error
	Update(ctx context.Context, expenditure *v1.Expenditure, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Expenditure, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.ExpenditureList, error)
}

type expendituresvc struct {
	store store.Factory
}

func newExpenditures(srv *service) *expendituresvc {
	return &expendituresvc{store: srv.store}
}

func (u *expendituresvc) Create(ctx context.Context, expenditure *v1.Expenditure, opts metav1.CreateOptions) error {
	if _, err := u.store.Expenditures().Get(ctx, int(expenditure.ID), metav1.GetOptions{}); err == nil {
		return errors.WrapCode(fmt.Errorf("expenditure id %d already exist", expenditure.ID), code.ErrExpenditureAlreadyExist)
	}
	if err := u.store.Expenditures().Create(ctx, expenditure, opts); err != nil {
		return errors.WithMessage(err, "create expenditure")
	}
	return nil
}

func (u *expendituresvc) Update(ctx context.Context, expenditure *v1.Expenditure, opts metav1.UpdateOptions) error {
	if err := u.store.Expenditures().Update(ctx, expenditure, opts); err != nil {
		return errors.WithMessage(err, "update expenditure")
	}
	return nil
}

func (u *expendituresvc) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if err := u.store.Expenditures().Delete(ctx, id, opts); err != nil {
		return errors.WithMessage(err, "delete expenditure")
	}
	return nil
}

func (u *expendituresvc) Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Expenditure, error) {
	expenditure, err := u.store.Expenditures().Get(ctx, id, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "get expenditure")
	}
	return expenditure, nil
}

func (u *expendituresvc) List(ctx context.Context, opts metav1.ListOptions) (*v1.ExpenditureList, error) {
	expenditures, err := u.store.Expenditures().List(ctx, opts)
	if err != nil {
		return nil, errors.WithMessage(err, "list expenditures")
	}

	return expenditures, nil
}
