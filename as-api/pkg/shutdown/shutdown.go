/*
Package shutdown Providing shutdown callbacks for graceful app shutdown

Example - posix signals

Graceful shutdown will listen for posix SIGINT and SIGTERM signals.
When they are received it will run all callbacks in separate go routines.
When callbacks return, the application will exit with os.Exit(0)
	package main

	import (
		"fmt"
		"time"

		"github.com/shipengqi/asapi/shutdown"
		"github.com/shipengqi/asapi/shutdown/managers"
	)

	func main() {
		// initialize shutdown
		gs := shutdown.New()

		// add posix shutdown manager
		gs.AddShutdownManager(managers.NewPosixSignalManager())

		// add your tasks that implement ShutdownCallback
		gs.AddShutdownCallback(shutdown.ShutdownFunc(func(string) error {
			fmt.Println("Shutdown callback start")
			time.Sleep(time.Second)
			fmt.Println("Shutdown callback finished")
			return nil
		}))

		// start shutdown managers
		if err := gs.Start(); err != nil {
			fmt.Println("Start:", err)
			return
		}

		// do other stuff
		time.Sleep(time.Hour)
	}

Example - posix signals with error handler

The same as above, except now we set an ErrorHandler that prints the
error returned from ShutdownCallback.

	package main

	import (
		"fmt"
		"time"
		"errors"

		"github.com/shipengqi/asapi/pkg/shutdown"
		"github.com/shipengqi/asapi/pkg/shutdown/managers"
	)

	func main() {
		// initialize shutdown
		gs := shutdown.New()

		// add posix shutdown manager
		gs.AddShutdownManager(managers.NewPosixSignalManager())

		// set error handler
		gs.SetErrorHandler(shutdown.ErrorFunc(func(err error) {
			fmt.Println("Error:", err)
		}))

		// add your tasks that implement ShutdownCallback
		gs.AddShutdownCallback(shutdown.ShutdownFunc(func(string) error {
			fmt.Println("Shutdown callback start")
			time.Sleep(time.Second)
			fmt.Println("Shutdown callback finished")
			return errors.New("my-error")
		}))

		// start shutdown managers
		if err := gs.Start(); err != nil {
			fmt.Println("Start:", err)
			return
		}

		// do other stuff
		time.Sleep(time.Hour)
	}
*/
package shutdown

import "sync"

// ShutdownCallback is an interface you have to implement for callbacks.
// OnShutdown will be called when shutdown is requested. The parameter
// is the name of the ShutdownManager that requested shutdown.
type ShutdownCallback interface {
	OnShutdown(string) error
}

// ShutdownFunc is a helper type, so you can easily provide anonymous functions
// as ShutdownCallbacks.
type ShutdownFunc func(string) error

// OnShutdown defines the action needed to run when shutdown triggered.
func (f ShutdownFunc) OnShutdown(shutdownManager string) error {
	return f(shutdownManager)
}

// ShutdownManager is an interface implemented by ShutdownManagers.
// GetName returns the name of ShutdownManager.
// ShutdownManagers start listening for shutdown requests in Start.
// When they call StartShutdown on GSInterface,
// first ShutdownStart() is called, then all ShutdownCallbacks are executed
// and once all ShutdownCallbacks return, ShutdownFinish is called.
type ShutdownManager interface {
	GetName() string
	Start(gs GSInterface) error
	ShutdownStart() error
	ShutdownFinish() error
}

// ErrorHandler is an interface you can pass to SetErrorHandler to
// handle asynchronous errors.
type ErrorHandler interface {
	OnError(err error)
}

// ErrorFunc is a helper type, so you can easily provide anonymous functions
// as ErrorHandlers.
type ErrorFunc func(err error)

// OnError defines the action needed to run when error occurred.
func (f ErrorFunc) OnError(err error) {
	f(err)
}

// GSInterface is an interface implemented by GracefulShutdown,
// that gets past to ShutdownManager to call StartShutdown when shutdown
// is requested.
type GSInterface interface {
	StartShutdown(sm ShutdownManager)
	ReportError(err error)
	AddShutdownCallback(shutdownCallback ShutdownCallback)
}

// GracefulShutdown is main struct that handles ShutdownCallbacks and
// ShutdownManagers. Initialize it with New.
type GracefulShutdown struct {
	callbacks    []ShutdownCallback
	managers     []ShutdownManager
	errorHandler ErrorHandler
}

// New initializes GracefulShutdown.
func New() *GracefulShutdown {
	return &GracefulShutdown{
		callbacks: make([]ShutdownCallback, 0, 10),
		managers:  make([]ShutdownManager, 0, 3),
	}
}

// Start calls Start on all added ShutdownManagers. The ShutdownManagers
// start to listen to shut down requests. Returns an error if any ShutdownManagers
// return an error.
func (gs *GracefulShutdown) Start() error {
	for _, manager := range gs.managers {
		if err := manager.Start(gs); err != nil {
			return err
		}
	}

	return nil
}

// AddShutdownManager adds a ShutdownManager that will listen to shutdown requests.
func (gs *GracefulShutdown) AddShutdownManager(manager ShutdownManager) {
	gs.managers = append(gs.managers, manager)
}

// AddShutdownCallback adds a ShutdownCallback that will be called when
// shutdown is requested.
//
// You can provide anything that implements ShutdownCallback interface,
// or you can supply a function like this:
//	AddShutdownCallback(shutdown.ShutdownFunc(func() error {
//		// callback code
//		return nil
//	}))
func (gs *GracefulShutdown) AddShutdownCallback(shutdownCallback ShutdownCallback) {
	gs.callbacks = append(gs.callbacks, shutdownCallback)
}

// SetErrorHandler sets an ErrorHandler that will be called when an error
// is encountered in ShutdownCallback or in ShutdownManager.
//
// You can provide anything that implements ErrorHandler interface,
// or you can supply a function like this:
//	SetErrorHandler(shutdown.ErrorFunc(func (err error) {
//		// handle error
//	}))
func (gs *GracefulShutdown) SetErrorHandler(errorHandler ErrorHandler) {
	gs.errorHandler = errorHandler
}

// StartShutdown is called from a ShutdownManager and will initiate shutdown.
// first call ShutdownStart on ShutdownManager,
// call all ShutdownCallbacks, wait for callbacks to finish and
// call ShutdownFinish on ShutdownManager.
func (gs *GracefulShutdown) StartShutdown(sm ShutdownManager) {
	gs.ReportError(sm.ShutdownStart())

	var wg sync.WaitGroup
	for _, shutdownCallback := range gs.callbacks {
		wg.Add(1)
		go func(shutdownCallback ShutdownCallback) {
			defer wg.Done()

			gs.ReportError(shutdownCallback.OnShutdown(sm.GetName()))
		}(shutdownCallback)
	}

	wg.Wait()

	gs.ReportError(sm.ShutdownFinish())
}

// ReportError is a function that can be used to report errors to
// ErrorHandler. It is used in ShutdownManagers.
func (gs *GracefulShutdown) ReportError(err error) {
	if err != nil && gs.errorHandler != nil {
		gs.errorHandler.OnError(err)
	}
}
