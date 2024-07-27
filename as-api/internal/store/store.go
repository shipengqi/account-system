package store

import (
	"context"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
)

var _client Factory

// Factory defines the storage interface.
type Factory interface {
	Drivers() DriverStore
	Orders() OrderStore
	Projects() ProjectStore
	Vehicles() VehicleStore
	Expenditures() ExpenditureStore
	Close() error
}

// Client returns the store client instance.
func Client() Factory {
	return _client
}

// SetClient set the store client.
func SetClient(factory Factory) {
	_client = factory
}

// DriverStore defines the driver storage interface.
type DriverStore interface {
	Create(ctx context.Context, driver *v1.Driver, opts metav1.CreateOptions) error
	Update(ctx context.Context, driver *v1.Driver, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Driver, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.DriverList, error)
}

// VehicleStore defines the user storage interface.
type VehicleStore interface {
	Create(ctx context.Context, vehicle *v1.Vehicle, opts metav1.CreateOptions) error
	Update(ctx context.Context, vehicle *v1.Vehicle, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, number string, opts metav1.GetOptions) (*v1.Vehicle, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.VehicleList, error)
}

// OrderStore defines the user storage interface.
type OrderStore interface {
	Create(ctx context.Context, order *v1.Order, opts metav1.CreateOptions) error
	Update(ctx context.Context, order *v1.Order, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Order, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.OrderList, error)
	OverallRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error)
	TimelineRevenueAndPayroll(ctx context.Context, vehicles, timeline []string) ([]*v1.Order, error)
	CMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error)
	LYMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error)
	LMRevenueAndPayroll(ctx context.Context) ([]*v1.Order, error)
}

// ProjectStore defines the project storage interface.
type ProjectStore interface {
	Create(ctx context.Context, project *v1.Project, opts metav1.CreateOptions) error
	Update(ctx context.Context, project *v1.Project, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, name string, opts metav1.GetOptions) (*v1.Project, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.ProjectList, error)
}

// ExpenditureStore defines the expenditure storage interface.
type ExpenditureStore interface {
	Create(ctx context.Context, expenditure *v1.Expenditure, opts metav1.CreateOptions) error
	Update(ctx context.Context, expenditure *v1.Expenditure, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, id int, opts metav1.GetOptions) (*v1.Expenditure, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.ExpenditureList, error)
	OverallExpenditure(ctx context.Context) ([]*v1.Expenditure, error)
	TimelineExpenditure(ctx context.Context, vehicles, timeline []string, etype int) ([]*v1.Expenditure, error)
	CMExpenditure(ctx context.Context) ([]*v1.Expenditure, error)
	LYMExpenditure(ctx context.Context) ([]*v1.Expenditure, error)
	LMExpenditure(ctx context.Context) ([]*v1.Expenditure, error)
}
