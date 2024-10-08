package timeutil

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMonthIntervalTimeFromNow(t *testing.T) {
	tests := []struct {
		mon   int
		start string
		end   string
	}{
		{-12, "2023-07-01", "2023-07-31"},
		{-8, "2023-11-01", "2023-11-30"},
		{-7, "2023-12-01", "2023-12-31"},
		{-6, "2024-01-01", "2024-01-31"},
		{-5, "2024-02-01", "2024-02-29"},
		{-4, "2024-03-01", "2024-03-31"},
		{-3, "2024-04-01", "2024-04-30"},
		{-2, "2024-05-01", "2024-05-31"},
		{-1, "2024-06-01", "2024-06-30"},
		{0, "2024-07-01", "2024-07-31"},
		{1, "2024-08-01", "2024-08-31"},
		{2, "2024-09-01", "2024-09-30"},
		{3, "2024-10-01", "2024-10-31"},
		{4, "2024-11-01", "2024-11-30"},
		{5, "2024-12-01", "2024-12-31"},
		{6, "2025-01-01", "2025-01-31"},
		{7, "2025-02-01", "2025-02-28"},
	}

	for _, v := range tests {
		t.Run(fmt.Sprintf("mon %d", v.mon), func(t *testing.T) {
			start, end := MonthIntervalTimeFromNow(v.mon)
			assert.Equal(t, v.start, start)
			assert.Equal(t, v.end, end)
		})
	}
}
