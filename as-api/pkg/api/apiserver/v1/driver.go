package v1

import (
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
)

// Driver represents a driver restful resource. It is also used as gorm model.
type Driver struct {
	// Standard object's metadata.
	metav1.ObjectMeta

	Name    string `json:"name" gorm:"column:name;" validate:"required"`
	Phone   string `json:"phone" gorm:"column:phone;" validate:"required"`
	Address string `json:"address" gorm:"column:address;" validate:"required"`
	Comment string `json:"comment" gorm:"column:comment;" validate:"min=1,max=255"`
	Status  int    `json:"status" gorm:"column:status;"`
}

// DriverList is the whole list of all drivers which have been stored in storage.
type DriverList struct {
	// Standard list metadata.
	// +optional
	metav1.ListMeta `json:",inline"`

	Items []*Driver `json:"items"`
}

func (d *Driver) TableName() string {
	return "as_driver"
}
