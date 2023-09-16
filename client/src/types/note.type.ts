import { Paragraph } from "./paragraph.type";

export type Note = {
  id: string;
  title: string;
  summary?: string;
  content: Array<Paragraph>;
  links: Array<string>;
};
