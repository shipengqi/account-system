package internal

import (
	"github.com/gin-gonic/gin"
	"github.com/shipengqi/asapi/internal/controller/v1/dashboard"
	"github.com/shipengqi/errors"

	"github.com/shipengqi/asapi/internal/controller/v1/driver"
	"github.com/shipengqi/asapi/internal/controller/v1/expenditure"
	"github.com/shipengqi/asapi/internal/controller/v1/order"
	"github.com/shipengqi/asapi/internal/controller/v1/project"
	"github.com/shipengqi/asapi/internal/controller/v1/vehicle"
	"github.com/shipengqi/asapi/internal/store/mysql"
	"github.com/shipengqi/asapi/pkg/code"
	"github.com/shipengqi/asapi/pkg/response"
)

func initRouter(g *gin.Engine) {
	installMiddlewares(g)
	installControllers(g)
}

func installMiddlewares(g *gin.Engine) {}

func installControllers(g *gin.Engine) {

	g.NoRoute(func(c *gin.Context) {
		response.Fail(c, errors.Codef(code.ErrPageNotFound, "Page not found."))
	})

	// v1 handlers, requiring authentication
	storeIns, _ := mysql.GetMySQLFactoryOr(nil)
	v1 := g.Group("/api/v1")
	{
		projectv1 := v1.Group("/projects")
		{
			projectc := project.New(storeIns)

			projectv1.POST("", projectc.Create)
			projectv1.DELETE("", projectc.Delete)
			projectv1.PUT("", projectc.Update)
			projectv1.GET("", projectc.List)
			projectv1.GET(":name", projectc.Get)
		}
		driverv1 := v1.Group("/drivers")
		{
			driverc := driver.New(storeIns)

			driverv1.POST("", driverc.Create)
			driverv1.DELETE("", driverc.Delete)
			driverv1.PUT("", driverc.Update)
			driverv1.GET("", driverc.List)
			driverv1.GET(":id", driverc.Get)
		}
		vehiclev1 := v1.Group("/vehicles")
		{
			vehiclec := vehicle.New(storeIns)

			vehiclev1.POST("", vehiclec.Create)
			vehiclev1.DELETE("", vehiclec.Delete)
			vehiclev1.PUT("", vehiclec.Update)
			vehiclev1.GET("", vehiclec.List)
			vehiclev1.GET(":number", vehiclec.Get)
		}
		orderv1 := v1.Group("/orders")
		{
			orderc := order.New(storeIns)

			orderv1.POST("", orderc.Create)
			orderv1.DELETE("", orderc.Delete)
			orderv1.PUT("", orderc.Update)
			orderv1.GET("", orderc.List)
			orderv1.GET(":id", orderc.Get)
		}
		expenditurev1 := v1.Group("/expenditures")
		{
			expenditurec := expenditure.New(storeIns)

			expenditurev1.POST("", expenditurec.Create)
			expenditurev1.DELETE("", expenditurec.Delete)
			expenditurev1.PUT("", expenditurec.Update)
			expenditurev1.GET("", expenditurec.List)
			expenditurev1.GET(":id", expenditurec.Get)
		}

		analysisv1 := v1.Group("/analysis")
		{
			analysisc := dashboard.New(storeIns)

			analysisv1.GET("/overall/revpay", analysisc.OverallRevenueAndPayroll)
			analysisv1.GET("/overall/exp", analysisc.OverallExpenditure)
			analysisv1.GET("/timeline/revpay", analysisc.TimelineRevenueAndPayroll)
			analysisv1.GET("/timeline/exp", analysisc.TimelineExpenditure)
			analysisv1.GET("/timeline/profit", analysisc.TimelineProfit)
		}
	}
}
