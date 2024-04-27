import { ObjectId } from "mongodb";

export type Post = {
  _id: ObjectId;
  title: string;
  author: string;
  description: string;
  content: string;
  timestamp: Date;
  title_slug: string;
  lastUpdated?: Date;
};

export type Event = {
  _id: ObjectId;
  title: string;
  description: string;
  date: Date;
  title_slug: string;
  lastUpdated?: Date;
};
