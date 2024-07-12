package v1

import metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"

// Expenditure represents an expenditure restful resource. It is also used as gorm model.
type Expenditure struct {
	// Standard object's metadata.
	metav1.ObjectMeta

	Type     int    `json:"type" gorm:"column:type;" validate:"required"`
	Cost     int    `json:"cost" gorm:"cost" validate:"required"`
	ExpendAt string `json:"expend_at" gorm:"column:expend_at;" validate:"required"`
	Comment  string `json:"comment" gorm:"column:comment;" validate:"min=1,max=255"`
}

// ExpenditureList is the whole list of all expenditures which have been stored in storage.
type ExpenditureList struct {
	// Standard list metadata.
	// +optional
	metav1.ListMeta `json:",inline"`

	Items []*Expenditure `json:"items"`
}

func (e *Expenditure) TableName() string {
	return "as_expenditure"
}
