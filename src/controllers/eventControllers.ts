import dotenv from "dotenv";
dotenv.config();
import db from "../db";
import { Request, Response } from "express";
import { Event } from "../types";

// get all events
export const getAllEvents = async (req: Request, res: Response) => {
  const results = await db
    .collection("events")
    .find()
    .sort({ timestamp: -1 })
    .toArray();
  res.status(200).send(results);
};

// get single event by title_slug
export const getEvent = async (req: Request, res: Response) => {
  const query = { title_slug: req.params.title_slug };
  const result: Event = await db.collection("events").findOne(query);

  if (!result) res.status(404).send("Not Found");
  else {
    res.status(200).send(result);
  }
};

// make new event
export const createEvent = async (req: Request, res: Response) => {
  // get request body and check if valid
  let event: Event = req.body;
  if (!event) res.status(400).send("No data provided");
  else if (!event.title || !event.date || !event.description || !event.location)
    res.status(400).send("Bad request; missing/incorrect info format");
  else {
    // check if event already exists (kind of scuffed but this is at least something)
    const query = { title_slug: event.title_slug };
    const exists: Event = await db.collection("events").findOne(query);
    if (exists) res.status(400).send("Event already exists");
    else {
      // add timestamp to event and slug
      event.title_slug = event.title.toLowerCase().replace(/\s/g, "-");

      // insert event into database
      const results = await db.collection("events").insertOne(event);
      res.status(201).send(results);
    }
  }
};

// update event by title_slug
export const updateEvent = async (req: Request, res: Response) => {
  // find event to update
  const query = { title_slug: req.params.title_slug };
  const event = await db.collection("events").findOne(query);
  if (!event) res.status(404).send("Event does not exist");
  else {
    const updatedEvent = {
      $set: {
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        location: req.body.location,
        title_slug: req.body.title.toLowerCase().replace(/\s/g, "-"),
      },
      $currentDate: { lastUpdated: true },
    };
    if (!updateEvent) {
      res.status(400).send("No data provided");
    }
    // check missing info
    else if (
      !updatedEvent.$set.title ||
      !updatedEvent.$set.date ||
      !updatedEvent.$set.description ||
      !updatedEvent.$set.location
    ) {
      res.status(400).send("Missing title, date, and or location");
    }

    // update post
    else {
      db.collection("events").updateOne(query, updatedEvent);
      res.send("Event updated").status(200);
    }
  }
};

// delete event by title_slug
export const deleteEvent = async (req: Request, res: Response) => {
  // find event to delete
  const query = { title_slug: req.params.title_slug };
  const event = await db.collection("events").findOne(query);
  if (!event) res.status(404).send("Event does not exist");
  else {
    db.collection("events").deleteOne(query);
    res.send("Event deleted").status(200);
  }
};
