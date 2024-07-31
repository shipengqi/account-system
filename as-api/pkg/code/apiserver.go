package code

//go:generate jaguar tool codegen -type=int

// asapi-apiserver: resource errors.
const (
	// ErrUserNotFound - 404: User not found.
	ErrUserNotFound int = iota + 110001

	// ErrUserAlreadyExist - 400: User already exist.
	ErrUserAlreadyExist
)

const (
	// ErrOrderNotFound - 404: Order not found.
	ErrOrderNotFound int = iota + 110101

	// ErrOrderAlreadyExist - 400: Order already exist.
	ErrOrderAlreadyExist
)

const (
	// ErrExpenditureNotFound - 404: Expenditure not found.
	ErrExpenditureNotFound int = iota + 110201

	// ErrExpenditureAlreadyExist - 400: Expenditure already exist.
	ErrExpenditureAlreadyExist
)

const (
	// ErrVehicleNotFound - 404: Vehicle not found.
	ErrVehicleNotFound int = iota + 110301

	// ErrVehicleAlreadyExist - 400: Vehicle already exist.
	ErrVehicleAlreadyExist
)

const (
	// ErrDriverNotFound - 404: Driver not found.
	ErrDriverNotFound int = iota + 110401

	// ErrDriverAlreadyExist - 400: Driver already exist.
	ErrDriverAlreadyExist
)

const (
	// ErrProjectNotFound - 404: Project not found.
	ErrProjectNotFound int = iota + 110501

	// ErrProjectAlreadyExist - 400: Project already exist.
	ErrProjectAlreadyExist
)
