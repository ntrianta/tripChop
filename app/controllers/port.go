package controllers

import (
	"github.com/ntrianta/tripChop/app/models"
	"github.com/revel/revel"
)

type PortJson struct {
	Port  string  `json:Port`
	Bytes float64 `json:bytes`
}

type Port struct {
	*revel.Controller
}

func (c Port) Ring() revel.Result {
	return c.Render()
}

func (c Port) Multibar() revel.Result {
	return c.Render()
}

func (c Port) Multiline() revel.Result {
	return c.Render()
}

func (c Port) Bar() revel.Result {
	return c.Render()
}

func (c Port) PortJson() revel.Result {
	x := 10
	results := models.HourlyPort()[0:x]
	output := []*PortJson{}
	for _, r := range results {
		output = append(output, &PortJson{
			Port:  r.Port["p"].(string),
			Bytes: r.Bytes,
		})
	}
	return c.RenderJson(output)
}
