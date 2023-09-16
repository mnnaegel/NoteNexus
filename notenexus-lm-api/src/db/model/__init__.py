import numpy as np
from dataclasses import dataclass

@dataclass
class Paragraph:
    id : str
    note_id : str
    next : str
    previous : str
    contents : str
    embedding : np.ndarray
    
    def as_doc(self):
        return {
            'id':self.id,
            'note_id' : self.note_id,
            'next' : self.next,
            'previous' : self.previous,
            'contents' : self.contents,
            'embedding' : self.embedding.tolist(), 
        }