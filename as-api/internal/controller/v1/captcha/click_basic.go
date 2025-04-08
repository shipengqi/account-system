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
	"github.com/wenlng/go-captcha/v2/click"
)

func (c *Controller) GetClickBasicCaptData(ctx *gin.Context) {
	log.Info("get click basic captcha data.")

	captData, err := textCapt.Generate()
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	dotData := captData.GetData()
	if dotData == nil {
		response.Fail(ctx, errors.New("captcha generate err"))
		return
	}

	var mBase64, tBase64 string
	mBase64, err = captData.GetMasterImage().ToBase64()
	if err != nil {
		response.Fail(ctx, err)
		return
	}
	tBase64, err = captData.GetThumbImage().ToBase64()
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	fmt.Println(">>>>> ", mBase64)
	fmt.Println(">>>>> ", tBase64)

	key := uuid.New().String()
	dots, _ := json.Marshal(dotData)
	fmt.Println(">>>>> ", string(dots))
	captchaDataCache[key] = dots
	response.OKWithData(ctx, map[string]interface{}{
		"key":          key,
		"image_base64": mBase64,
		"thumb_base64": tBase64,
	})
}

type Data struct {
	Dots string `json:"dots"`
	Key  string `json:"key"`
}

func (c *Controller) CheckClickBasicCaptData(ctx *gin.Context) {
	log.Info("check click basic captcha data.")

	var u Data

	if err := ctx.ShouldBindJSON(&u); err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrBind))
		return
	}

	val, ok := captchaDataCache[u.Key]
	if !ok {
		response.Fail(ctx, errors.WrapCode(errors.New("invalid captcha"), code.ErrBind))
		return
	}

	src := strings.Split(u.Dots, ",")
	var dct map[int]*click.Dot
	if err := json.Unmarshal(val, &dct); err != nil {
		response.Fail(ctx, errors.WrapCode(errors.New("illegal key"), code.ErrBind))
		return
	}
	chkRet := false
	if (len(dct) * 2) == len(src) {
		for i := 0; i < len(dct); i++ {
			dot := dct[i]
			j := i * 2
			k := i*2 + 1
			sx, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[j]), 64)
			sy, _ := strconv.ParseFloat(fmt.Sprintf("%v", src[k]), 64)

			chkRet = click.CheckPoint(int64(sx), int64(sy), int64(dot.X), int64(dot.Y), int64(dot.Width), int64(dot.Height), 0)
			if !chkRet {
				break
			}
		}
	}

	response.OKWithData(ctx, chkRet)
}
