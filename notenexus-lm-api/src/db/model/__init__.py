import numpy as np
from dataclasses import dataclass

@dataclass
class Paragraph:
    contents : str
    note_id : str
    next : str
    previous : str
    embedding : np.ndarray
    
    def for_es(self):
        return {
            'contents' : self.contents,
            'note_id' : self.note_id,
            'next' : self.next,
            'previous' : self.previous,
            'embedding' : self.embedding.tolist(), 
        }