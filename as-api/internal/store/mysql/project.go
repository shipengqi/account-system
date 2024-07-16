package mysql

import (
	"context"

	"github.com/shipengqi/errors"
	"gorm.io/gorm"

	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/util/gormutil"
)

type projects struct {
	db *gorm.DB
}

func newProjects(ds *datastore) *projects {
	return &projects{ds.db}
}

// Create creates a new project.
func (v *projects) Create(ctx context.Context, project *v1.Project, opts metav1.CreateOptions) error {
	// return u.db.Transaction(func(tx *gorm.DB) error {
	// 	err := tx.Create(user).Error
	// 	if err != nil {
	// 		return err
	// 	}
	// 	// do more operations in transaction
	// 	return nil
	// })

	return v.db.Create(project).Error
}

// Update updates a project information.
func (v *projects) Update(ctx context.Context, project *v1.Project, opts metav1.UpdateOptions) (err error) {
	return v.db.Where("id = ?", project.ID).Updates(project).Error
}

// Delete deletes a project.
func (v *projects) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if opts.Unscoped {
		v.db = v.db.Unscoped()
	}

	project := &v1.Project{}
	err := v.db.Where("id = ?", id).First(&project).Error
	if err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return v.db.Where("id = ?", id).Delete(project).Error
}

// Get returns a project.
func (v *projects) Get(ctx context.Context, name string, opts metav1.GetOptions) (*v1.Project, error) {
	project := &v1.Project{}
	err := v.db.Where("name = ?", name).First(&project).Error
	if err != nil {
		return nil, err
	}

	return project, nil
}

// List return all projects.
func (v *projects) List(ctx context.Context, opts metav1.ListOptions) (*v1.ProjectList, error) {
	ret := &v1.ProjectList{Items: make([]*v1.Project, 0)}

	// Todo order, selector, add status option
	ol := gormutil.DePointer(opts.Offset, opts.Limit)
	d := v.db.
		Offset(ol.Offset).
		Limit(ol.Limit).
		Order("id desc").
		Find(&ret.Items).
		Offset(-1).
		Limit(-1).
		Count(&ret.Total)

	return ret, d.Error
}
