package v1

import (
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
)

// Order represents an order restful resource. It is also used as gorm model.
type Order struct {
	// Standard object's metadata.
	metav1.ObjectMeta

	ProjectID     uint64 `json:"project_id" gorm:"column:project_id;" validate:"required"`
	VehicleID     uint64 `json:"vehicle_id" gorm:"column:vehicle_id;" validate:"required"`
	DriverID      uint64 `json:"driver_id" gorm:"column:driver_id;" validate:"required"`
	Weight        int    `json:"weight" gorm:"weight"`
	Mileage       int    `json:"mileage" gorm:"column:mileage;"`
	Freight       int    `json:"freight" gorm:"column:freight;"`
	Payroll       int    `json:"payroll" gorm:"column:payroll;"`
	Status        int    `json:"status" gorm:"column:status;"`
	LoadAt        string `json:"load_at" gorm:"column:load_at;"`
	UnLoadAt      string `json:"unload_at" gorm:"column:unload_at;"`
	Comment       string `json:"comment" gorm:"column:comment;" validate:"min=1,max=255"`
	VehicleNumber string `json:"vehicle_number" gorm:"->"`
	Project       string `json:"project" gorm:"->"`
	Driver        string `json:"driver" gorm:"->"`
}

// OrderList is the whole list of all orders which have been stored in storage.
type OrderList struct {
	// Standard list metadata.
	// +optional
	metav1.ListMeta `json:",inline"`

	Items []*Order `json:"items"`
}

func (o *Order) TableName() string {
	return "as_order"
}
