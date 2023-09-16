import { Paragraph } from "./paragraph.type";

export type Note = {
  id: string;
  title: string;
  summary?: string;
  author: string; // userid of author
  content?: Array<Paragraph>;
  links: Array<string>;
};
