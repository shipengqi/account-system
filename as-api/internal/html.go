package internal

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shipengqi/asapi/resources"
)

type HtmlHandler struct{}

func NewHtmlHandler() *HtmlHandler {
	return &HtmlHandler{}
}

// RedirectIndex 重定向
func (h *HtmlHandler) RedirectIndex(c *gin.Context) {
	c.Redirect(http.StatusFound, "/")
	return
}

func (h *HtmlHandler) Index(c *gin.Context) {
	c.Header("content-type", "text/html;charset=utf-8")
	c.String(200, string(resources.Html))
	return
}
