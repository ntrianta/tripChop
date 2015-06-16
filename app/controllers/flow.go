package controllers

import (
	"github.com/ntrianta/tripChop/app/models"
	"github.com/revel/revel"
)

type FlowJson struct {
	SourceIP   string  `json:sourceIP`
	DestIP     string  `json:destinationIP`
	SourcePort string  `json:sourcePort`
	DestPort   string  `json:destinationPort`
	Proto      string  `json:protocol`
	Bytes      float64 `json:bytes`
	Avg        float64 `json:average`
	Packets    int     `json:packets`
}

type Flow struct {
	*revel.Controller
}

func (c Flow) AggregateFlow() revel.Result {
	return c.Render()
}

func (c Flow) FlowJson() revel.Result {
	results := models.Aggregate()
	output := []*FlowJson{}
	for _, r := range results {
		output = append(output, &FlowJson{
			SourceIP:   r.Flow["si"].(string),
			DestIP:     r.Flow["di"].(string),
			SourcePort: r.Flow["sp"].(string),
			DestPort:   r.Flow["dp"].(string),
			Proto:      r.Flow["p"].(string),
			Bytes:      r.Bytes,
			Packets:    r.Packets,
			Avg:        r.Average,
		})
	}
	return c.RenderJson(output)
}
