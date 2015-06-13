package controllers

import "github.com/revel/revel"

type Flow struct {
	*revel.Controller
}

func (c Flow) Foo() revel.Result {
  bar := "meh meh meh"
	return c.Render(bar)
}
