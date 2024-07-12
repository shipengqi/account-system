package v1

import (
	"context"

	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/internal/store"
	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	metav1 "github.com/shipengqi/asapi/pkg/api/meta/v1"
	"github.com/shipengqi/asapi/pkg/code"
)

var _ ProjectService = &projectsvc{}

type ProjectService interface {
	Create(ctx context.Context, project *v1.Project, opts metav1.CreateOptions) error
	Update(ctx context.Context, project *v1.Project, opts metav1.UpdateOptions) error
	Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error
	Get(ctx context.Context, name string, opts metav1.GetOptions) (*v1.Project, error)
	List(ctx context.Context, opts metav1.ListOptions) (*v1.ProjectList, error)
}

type projectsvc struct {
	store store.Factory
}

func newProjects(srv *service) *projectsvc {
	return &projectsvc{store: srv.store}
}

func (u *projectsvc) Create(ctx context.Context, project *v1.Project, opts metav1.CreateOptions) error {
	if _, err := u.store.Projects().Get(ctx, project.Name, metav1.GetOptions{}); err == nil {
		return errors.Codef(code.ErrUserAlreadyExist, "projet %s already exist", project.Name)
	}
	if err := u.store.Projects().Create(ctx, project, opts); err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}
	return nil
}

func (u *projectsvc) Update(ctx context.Context, project *v1.Project, opts metav1.UpdateOptions) error {
	if err := u.store.Projects().Update(ctx, project, opts); err != nil {
		return errors.WithCode(err, code.ErrDatabase)
	}

	return nil
}

func (u *projectsvc) Delete(ctx context.Context, id int, opts metav1.DeleteOptions) error {
	if err := u.store.Projects().Delete(ctx, id, opts); err != nil {
		return err
	}

	return nil
}

func (u *projectsvc) Get(ctx context.Context, name string, opts metav1.GetOptions) (*v1.Project, error) {
	project, err := u.store.Projects().Get(ctx, name, opts)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (u *projectsvc) List(ctx context.Context, opts metav1.ListOptions) (*v1.ProjectList, error) {
	projects, err := u.store.Projects().List(ctx, opts)
	if err != nil {
		log.Errorf("list projects from storage failed: %s", err.Error())

		return nil, errors.WithCode(err, code.ErrDatabase)
	}

	return projects, nil
}
