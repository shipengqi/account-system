package auth

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shipengqi/errors"

	"github.com/shipengqi/asapi/pkg/middlewares"
	"github.com/shipengqi/asapi/pkg/response"
)

const authHeaderCount = 2

// AutoStrategy defines authentication strategy which can automatically choose between Basic and Bearer
// according `Authorization` header.
type AutoStrategy struct {
	basic middlewares.AuthStrategy
	jwt   middlewares.AuthStrategy
}

var _ middlewares.AuthStrategy = &AutoStrategy{}

// NewAutoStrategy create auto strategy with basic strategy and jwt strategy.
func NewAutoStrategy(basic, jwt middlewares.AuthStrategy) AutoStrategy {
	return AutoStrategy{
		basic: basic,
		jwt:   jwt,
	}
}

// AuthFunc defines auto strategy as the gin authentication middleware.
func (a AutoStrategy) AuthFunc() gin.HandlerFunc {
	return func(c *gin.Context) {
		operator := middlewares.AuthOperator{}
		authHeader := strings.SplitN(c.Request.Header.Get("Authorization"), " ", 2)

		if len(authHeader) != authHeaderCount {
			response.Fail(c, errors.New("Authorization header format is wrong."))
			c.Abort()
			return
		}

		switch authHeader[0] {
		case "Basic":
			operator.SetStrategy(a.basic)
		case "Bearer":
			operator.SetStrategy(a.jwt)
		default:
			response.Fail(c, errors.New("unrecognized Authorization header."))
			c.Abort()
			return
		}

		operator.AuthFunc()(c)

		c.Next()
	}
}
