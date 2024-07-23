package v1

import "github.com/shipengqi/asapi/internal/store"

// Interface defines functions used to return resource interface.
type Interface interface {
	Drivers() DriverService
	Orders() OrderService
	Projects() ProjectService
	Vehicles() VehicleService
	Expenditures() ExpenditureService
	Dashboard() DashboardService
}

type service struct {
	store store.Factory
}

// NewService returns Service interface.
func NewService(store store.Factory) Interface {
	return &service{
		store: store,
	}
}

func (s *service) Drivers() DriverService {
	return newDrivers(s)
}

func (s *service) Orders() OrderService {
	return newOrders(s)
}

func (s *service) Vehicles() VehicleService {
	return newVehicles(s)
}

func (s *service) Expenditures() ExpenditureService {
	return newExpenditures(s)
}

func (s *service) Projects() ProjectService {
	return newProjects(s)
}

func (s *service) Dashboard() DashboardService {
	return newDashboard(s)
}
