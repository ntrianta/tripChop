package models

import (
	//"github.com/revel/revel"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Port struct {
	Port  bson.M  `bson:"_id"`
	Bytes float64 `bson:"b"`
}

func HourlyPort() []Port {
	results := []Port{}

	fromDate := time.Date(2014, time.August, 12, 9, 0, 0, 0, time.UTC)
	toDate := time.Date(2014, time.August, 12, 10, 0, 0, 0, time.UTC)

	session, _ := mgo.Dial("localhost:27017")
	collection := session.DB("pcap").C("flow")
	collection.Pipe([]bson.M{
		{"$match": bson.M{"ts": bson.M{"$gte": fromDate, "$lte": toDate}, "p": "TCP", "sp": bson.M{"$ne": "ignore"}}}, //minor workaround to a bug in parsing
		{"$group": bson.M{
			"_id": bson.M{"p": "$sp"},
			"b":   bson.M{"$sum": "$l"},
		}},
		{"$sort": bson.D{{"b", -1}}},
	}).All(&results)
	session.Close()
	return results
}
