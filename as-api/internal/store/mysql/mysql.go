package mysql

import (
	"fmt"
	"sync"

	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"
	"gorm.io/gorm"

	"github.com/shipengqi/asapi/internal/store"
	v1 "github.com/shipengqi/asapi/pkg/api/apiserver/v1"
	"github.com/shipengqi/asapi/pkg/db"
	dblogger "github.com/shipengqi/asapi/pkg/db/logger"
)

var (
	_factory store.Factory
	once     sync.Once
)

type datastore struct {
	db *gorm.DB
}

func (ds *datastore) Drivers() store.DriverStore {
	return newDrivers(ds)
}
func (ds *datastore) Expenditures() store.ExpenditureStore {
	return newExpenditures(ds)
}
func (ds *datastore) Orders() store.OrderStore {
	return newOrders(ds)
}
func (ds *datastore) Vehicles() store.VehicleStore {
	return newVehicles(ds)
}
func (ds *datastore) Projects() store.ProjectStore {
	return newProjects(ds)
}

func (ds *datastore) Close() error {
	instance, err := ds.db.DB()
	if err != nil {
		return errors.Wrap(err, "get gorm db instance failed")
	}

	return instance.Close()
}

// GetMySQLFactoryOr create mysql factory with the given config.
func GetMySQLFactoryOr(opts *db.Options) (store.Factory, error) {
	if opts == nil && _factory == nil {
		return nil, fmt.Errorf("failed to get mysql store fatory")
	}

	var (
		err      error
		instance *gorm.DB
	)
	once.Do(func() {
		opts.Logger = dblogger.New(dblogger.Silent)
		instance, err = db.New(opts)
		if err != nil {
			log.Fatal(err.Error())
			return
		}

		// uncomment the following line if you need auto migration the given models
		// not suggested in production environment.
		// err = MigrateDatabase(instance)
		// if err != nil {
		// 	log.Fatal(err.Error())
		// 	return
		// }

		if opts.Debug {
			instance = instance.Debug()
		}

		_factory = &datastore{instance}
	})

	if _factory == nil || err != nil {
		return nil, fmt.Errorf("failed to get mysql store fatory, mysql factory: %+v, error: %w", _factory, err)
	}

	return _factory, nil
}

// CleanDatabase tear downs the database tables.
//
//nolint:unused
func CleanDatabase(db *gorm.DB) error {
	tables := []interface{}{
		v1.User{},
	}
	for _, t := range tables {
		if err := db.Migrator().DropTable(&t); err != nil {
			return errors.Wrap(err, "drops table failed")
		}
	}

	return nil
}

// MigrateDatabase run auto migration for given models, will only add missing fields,
// won't delete/change current data.
//
//nolint:unused
func MigrateDatabase(db *gorm.DB) error {
	tables := []interface{}{
		v1.User{},
	}

	for _, t := range tables {
		if err := db.AutoMigrate(&t); err != nil {
			return errors.Wrap(err, "migrate table failed")
		}
	}

	return nil
}

// ResetDatabase resets the database tables.
//
//nolint:unused,deadcode
func ResetDatabase(db *gorm.DB) error {
	if err := CleanDatabase(db); err != nil {
		return err
	}
	if err := MigrateDatabase(db); err != nil {
		return err
	}

	return nil
}
