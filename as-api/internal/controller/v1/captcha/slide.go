package captcha

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
	"github.com/shipengqi/component-base/json"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"
	"github.com/wenlng/go-captcha/v2/slide"
)

func (c *Controller) GetSlideCaptData(ctx *gin.Context) {
	log.Info("get slide basic captcha data.")

	captData, err := slideBasicCapt.Generate()
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	blockData := captData.GetData()
	if blockData == nil {
		response.Fail(ctx, errors.New("captcha generate err"))
		return
	}

	var mBase64, tBase64 string
	mBase64, err = captData.GetMasterImage().ToBase64()
	if err != nil {
		response.Fail(ctx, err)
		return
	}
	tBase64, err = captData.GetTileImage().ToBase64()
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	fmt.Println(">>>>> ", mBase64)
	fmt.Println(">>>>> ", tBase64)

	key := uuid.New().String()
	dotsByte, _ := json.Marshal(blockData)
	fmt.Println(">>>>> ", string(dotsByte))
	captchaDataCache[key] = dotsByte
	response.OKWithData(ctx, map[string]interface{}{
		"key":          key,
		"image_base64": mBase64,
		"tile_base64":  tBase64,
		"tile_width":   blockData.Width,
		"tile_height":  blockData.Height,
		"tile_x":       blockData.TileX,
		"tile_y":       blockData.TileY,
	})
}

type SlideData struct {
	Point string `json:"point"`
	Key   string `json:"key"`
}

func (c *Controller) CheckSlideCaptData(ctx *gin.Context) {
	log.Info("check slide basic captcha data.")

	var u SlideData

	if err := ctx.ShouldBindJSON(&u); err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrBind))
		return
	}

	val, ok := captchaDataCache[u.Key]
	if !ok {
		response.Fail(ctx, errors.WrapCode(errors.New("invalid captcha"), code.ErrBind))
		return
	}

	src := strings.Split(u.Point, ",")
	var dct *slide.Block
	if err := json.Unmarshal(val, &dct); err != nil {
		response.Fail(ctx, errors.WrapCode(errors.New("illegal key"), code.ErrBind))
		return
	}
	chkRet := false
	if 2 == len(src) {
		sx, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[0]), 64)
		sy, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[1]), 64)
		chkRet = slide.CheckPoint(int64(sx), int64(sy), int64(dct.X), int64(dct.Y), 4)
	}

	response.OKWithData(ctx, chkRet)
}
