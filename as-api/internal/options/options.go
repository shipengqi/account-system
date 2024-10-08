package options

import (
	cliflag "github.com/shipengqi/component-base/cli/flag"
	"github.com/shipengqi/component-base/json"
	"github.com/shipengqi/log"

	"github.com/shipengqi/asapi/pkg/db"
	genericoptions "github.com/shipengqi/asapi/pkg/options"
)

type Options struct {
	GenericServerRunOptions *genericoptions.ServerRunOptions       `json:"server"   mapstructure:"server"`
	SecureServing           *genericoptions.SecureServingOptions   `json:"secure"   mapstructure:"secure"`
	InsecureServing         *genericoptions.InsecureServingOptions `json:"insecure" mapstructure:"insecure"`
	FeatureOptions          *genericoptions.FeatureOptions         `json:"feature"  mapstructure:"feature"`
	MySQLOptions            *db.Options                            `json:"mysql"    mapstructure:"mysql"`
	Log                     *log.Options                           `json:"log"      mapstructure:"log"`
}

func New() *Options {
	return &Options{
		GenericServerRunOptions: genericoptions.NewServerRunOptions(),
		InsecureServing:         genericoptions.NewInsecureServingOptions(),
		SecureServing:           genericoptions.NewSecureServingOptions(),
		FeatureOptions:          genericoptions.NewFeatureOptions(),
		MySQLOptions:            db.NewOptions(),
		Log:                     log.NewOptions(),
	}
}

func (o *Options) Flags() (fss cliflag.NamedFlagSets) {
	o.GenericServerRunOptions.AddFlags(fss.FlagSet("generic"))
	o.InsecureServing.AddFlags(fss.FlagSet("insecure serving"))
	o.SecureServing.AddFlags(fss.FlagSet("secure serving"))
	o.FeatureOptions.AddFlags(fss.FlagSet("features"))
	o.MySQLOptions.AddFlags(fss.FlagSet("mysql"))
	o.Log.AddFlags(fss.FlagSet("logs"))
	return
}

// Validate is used to parse and validate the parameters entered by the user at
// the command line when the program starts.
func (o *Options) Validate() []error {
	var errs []error

	errs = append(errs, o.InsecureServing.Validate()...)
	errs = append(errs, o.SecureServing.Validate()...)
	errs = append(errs, o.MySQLOptions.Validate()...)
	errs = append(errs, o.Log.Validate()...)
	errs = append(errs, o.FeatureOptions.Validate()...)

	return errs
}

// Complete set default Options.
func (o *Options) Complete() error {
	return nil
}

func (o *Options) String() string {
	data, _ := json.Marshal(o)

	return string(data)
}
