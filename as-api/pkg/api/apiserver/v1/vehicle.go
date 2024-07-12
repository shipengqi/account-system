package v1

import (
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
)

// Vehicle represents a vehicle restful resource. It is also used as gorm model.
type Vehicle struct {
	// Standard object's metadata.
	metav1.ObjectMeta

	Number  string `json:"number" gorm:"column:number;" validate:"required"`
	Brand   string `json:"brand" gorm:"column:brand;" validate:"required"`
	Comment string `json:"comment" gorm:"column:comment;" validate:"min=1,max=255"`
	Status  int    `json:"status" gorm:"column:status;"`
}

// VehicleList is the whole list of all vehicles which have been stored in storage.
type VehicleList struct {
	// Standard list metadata.
	// +optional
	metav1.ListMeta `json:",inline"`

	Items []*Vehicle `json:"items"`
}

func (v *Vehicle) TableName() string {
	return "as_vehicle"
}
