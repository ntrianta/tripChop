package models

import (
	//"github.com/revel/revel"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Flow struct {
	Flow    bson.M  `bson:"_id"`
	Packets int     `bson:"p"`
	Bytes   float64 `bson:"b"`
	Average float64 `bson:"a"`
}

func HourlyFlow(startDay int, endDay int, startHour int, endHour int, startMinute int, endMinute int) []Flow {
	results := []Flow{}

	fromDate := time.Date(2014, time.August, startDay, startHour, startMinute, 0, 0, time.UTC)
	toDate := time.Date(2014, time.August, endDay, endHour, endMinute, 0, 0, time.UTC)

	session, _ := mgo.Dial("localhost:27017")
	collection := session.DB("pcap").C("flow")
	collection.Pipe([]bson.M{
		{"$match": bson.M{"ts": bson.M{"$gte": fromDate, "$lte": toDate}, "p": "TCP", "sp": bson.M{"$ne": "ignore"}}},
		{"$group": bson.M{
			"_id": bson.M{"si": "$si", "di": "$di", "p": "$p"},
			"p":   bson.M{"$sum": 1},
			"b":   bson.M{"$sum": "$l"},
			"a":   bson.M{"$avg": "$l"},
		}},
	}).All(&results)
	session.Close()
	return results
}
