export interface ParagraphData {
    content: string;
    links: string[];
    noteId: string;
    paraId: string;

};


export class LinkedNode {
  public after: LinkedNode | null = null;
  public before: LinkedNode | null = null;
  constructor(public data: ParagraphData) {}
}
