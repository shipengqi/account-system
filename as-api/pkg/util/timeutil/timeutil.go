package timeutil

import "time"

// MonthIntervalTimeFromNow return the start date and end date of the given month
// if mon = 0, indicate current month
// if mon = -1, indicate last month
// if mon = 1, indicate next month
func MonthIntervalTimeFromNow(mon int) (start, end string) {
	year, month, _ := time.Now().Date()
	thisMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	start = thisMonth.AddDate(0, mon, 0).Format("2006-01-02")
	end = thisMonth.AddDate(0, mon+1, -1).Format("2006-01-02")
	return start, end
}

func MonthIntervalTimeWithGivenDate(mon string) (start, end string) {
	conv, _ := time.ParseInLocation("2006-01-02 15:04:05", mon, time.Local)
	year, month, _ := conv.Date()
	givenMonth := time.Date(year, month, 1, 0, 0, 0, 0, time.Local)
	start = givenMonth.AddDate(0, 0, 0).Format("2006-01-02")
	end = givenMonth.AddDate(0, 1, -1).Format("2006-01-02")
	return start, end
}
