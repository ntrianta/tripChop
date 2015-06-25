package controllers

import (
	"github.com/ntrianta/tripChop/app/models"
	"github.com/revel/revel"
	"math"
)

type FlowJson struct {
	SourceIP string `json:sourceIP`
	DestIP   string `json:destinationIP`
	//SourcePort string  `json:sourcePort`
	//DestPort   string  `json:destinationPort`
	Proto   string  `json:protocol`
	Bytes   float64 `json:bytes`
	Avg     float64 `json:average`
	Packets int     `json:packets`
}

type Flow struct {
	*revel.Controller
}

func (c Flow) Scatter() revel.Result {
	return c.Render()
}

func (c Flow) Details() revel.Result {
	return c.Render()
}

func (c Flow) Chord() revel.Result {
	return c.Render()
}

func (c Flow) Slope() revel.Result {
	return c.Render()
}

func (c Flow) FlowJson(startDay int, endDay int, startHour int, endHour int, startMinute int, endMinute int) revel.Result {
	results := models.HourlyFlow(startDay, endDay, startHour,
		endHour, startMinute, endMinute)
	output := []*FlowJson{}
	for _, r := range results {
		output = append(output, &FlowJson{
			SourceIP: r.Flow["si"].(string),
			DestIP:   r.Flow["di"].(string),
			//SourcePort: r.Flow["sp"].(string),
			//DestPort:   r.Flow["dp"].(string),
			Proto:   r.Flow["p"].(string),
			Bytes:   math.Floor(r.Bytes / 1000),
			Packets: r.Packets,
			Avg:     math.Floor(r.Average),
		})
	}
	return c.RenderJson(output)
}
