package captcha

import (
	"github.com/golang/freetype/truetype"
	"github.com/shipengqi/log"
	"github.com/wenlng/go-captcha-assets/bindata/chars"
	"github.com/wenlng/go-captcha-assets/resources/fonts/fzshengsksjw"
	"github.com/wenlng/go-captcha-assets/resources/images_v2"
	"github.com/wenlng/go-captcha-assets/resources/tiles"
	"github.com/wenlng/go-captcha/v2/base/option"
	"github.com/wenlng/go-captcha/v2/click"
	"github.com/wenlng/go-captcha/v2/rotate"
	"github.com/wenlng/go-captcha/v2/slide"

	svcv1 "github.com/shipengqi/asapi/internal/service/v1"
	"github.com/shipengqi/asapi/internal/store"
)

var captchaDataCache = make(map[string][]byte)

// Controller create a user handler used to handle request for user resource.
type Controller struct {
	svc svcv1.Interface
}

// New creates a user Controller.
func New(store store.Factory) *Controller {
	return &Controller{
		svc: svcv1.NewService(store),
	}
}

var textCapt click.Captcha
var rotateBasicCapt rotate.Captcha
var slideBasicCapt slide.Captcha

func init() {
	initClickBasicCaptcha()
	initRotateCaptcha()
	initSlideBasicCaptcha()
}

func initClickBasicCaptcha() {
	builder := click.NewBuilder(
		click.WithRangeLen(option.RangeVal{Min: 4, Max: 6}),
		click.WithRangeVerifyLen(option.RangeVal{Min: 2, Max: 4}),
	)

	// fonts
	fonts, err := fzshengsksjw.GetFont()
	if err != nil {
		log.Fatal(err.Error())
	}

	imgs, err := images.GetImages()
	if err != nil {
		log.Fatal(err.Error())
	}

	builder.SetResources(
		click.WithChars(chars.GetChineseChars()),
		click.WithFonts([]*truetype.Font{fonts}),
		click.WithBackgrounds(imgs),
	)

	textCapt = builder.Make()
}

func initRotateCaptcha() {
	builder := rotate.NewBuilder(rotate.WithRangeAnglePos([]option.RangeVal{
		{Min: 20, Max: 330},
	}))

	// background images
	imgs, err := images.GetImages()
	if err != nil {
		log.Fatal(err.Error())
	}

	// set resources
	builder.SetResources(
		rotate.WithImages(imgs),
	)

	rotateBasicCapt = builder.Make()
}

func initSlideBasicCaptcha() {
	builder := slide.NewBuilder()

	// background images
	imgs, err := images.GetImages()
	if err != nil {
		log.Fatal(err.Error())
	}

	graphs, err := tiles.GetTiles()
	if err != nil {
		log.Fatal(err.Error())
	}

	var newGraphs = make([]*slide.GraphImage, 0, len(graphs))
	for i := 0; i < len(graphs); i++ {
		graph := graphs[i]
		newGraphs = append(newGraphs, &slide.GraphImage{
			OverlayImage: graph.OverlayImage,
			MaskImage:    graph.MaskImage,
			ShadowImage:  graph.ShadowImage,
		})
	}

	// set resources
	builder.SetResources(
		slide.WithGraphImages(newGraphs),
		slide.WithBackgrounds(imgs),
	)

	slideBasicCapt = builder.Make()
}
