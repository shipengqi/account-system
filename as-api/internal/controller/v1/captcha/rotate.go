package captcha

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
	"github.com/shipengqi/component-base/json"
	"github.com/shipengqi/errors"
	"github.com/shipengqi/log"
	"github.com/wenlng/go-captcha/v2/rotate"
)

func (c *Controller) GetRotateCaptData(ctx *gin.Context) {
	log.Info("get rotate captcha data.")

	captData, err := rotateBasicCapt.Generate()
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
	tBase64, err = captData.GetThumbImage().ToBase64()
	if err != nil {
		response.Fail(ctx, err)
		return
	}

	fmt.Println(">>>>> ", mBase64)
	fmt.Println(">>>>> ", tBase64)

	key := uuid.New().String()
	blockByte, _ := json.Marshal(blockData)
	fmt.Println(">>>>> ", string(blockByte))
	captchaDataCache[key] = blockByte
	response.OKWithData(ctx, map[string]interface{}{
		"key":          key,
		"thumb_size":   blockData.Width,
		"image_base64": mBase64,
		"thumb_base64": tBase64,
	})
}

type RotateData struct {
	Angle int    `json:"angle"`
	Key   string `json:"key"`
}

func (c *Controller) CheckRotateCaptData(ctx *gin.Context) {
	log.Info("check rotate captcha data.")

	var u RotateData

	if err := ctx.ShouldBindJSON(&u); err != nil {
		response.Fail(ctx, errors.WrapCode(err, code.ErrBind))
		return
	}

	val, ok := captchaDataCache[u.Key]
	if !ok {
		response.Fail(ctx, errors.WrapCode(errors.New("invalid rotate captcha"), code.ErrBind))
		return
	}

	var dct *rotate.Block
	if err := json.Unmarshal(val, &dct); err != nil {
		response.Fail(ctx, errors.WrapCode(errors.New("illegal rotate captcha key"), code.ErrBind))
		return
	}
	sAngle, _ := strconv.ParseFloat(fmt.Sprintf("%v", u.Angle), 64)
	chkRet := rotate.CheckAngle(int64(sAngle), int64(dct.Angle), 2)

	response.OKWithData(ctx, chkRet)
}
