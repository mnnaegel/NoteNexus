import { Paragraph } from "./paragraph.type";

export type Note = {
  id: string;
  name: string;
  summary?: string;
  content: Array<Paragraph>;
  links: Array<string>;
};
