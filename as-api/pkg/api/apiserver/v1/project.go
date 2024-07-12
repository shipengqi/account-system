package v1

import metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"

// Project represents a project restful resource. It is also used as gorm model.
type Project struct {
	// Standard object's metadata.
	metav1.ObjectMeta

	Name    string `json:"name" gorm:"column:name;" validate:"required"`
	StartAt string `json:"start_at" gorm:"column:start_at;" validate:"required"`
	EndAt   string `json:"end_at" gorm:"column:end_at;" validate:"required"`
	Comment string `json:"comment" gorm:"column:comment;" validate:"min=1,max=255"`
	Status  int    `json:"status" gorm:"column:status;"`
}

// ProjectList is the whole list of all projects which have been stored in storage.
type ProjectList struct {
	// Standard list metadata.
	// +optional
	metav1.ListMeta `json:",inline"`

	Items []*Project `json:"items"`
}

func (p *Project) TableName() string { return "as_project" }
