# NoteNexus
## Inspiration
NoteNexus was built to meet the needs of students that don't always have time to manually organize their notes. Existing notetaking tools, such as Obsidian, require manual annotation to tie concepts together.

## What it does
We use large language models (LLMs) and vector indexing to link notes together automatically and expose insights that you weren't aware you had documented. 

NoteNexus provides an interface for users to track their Notes. Within each Note is a collection of paragraphs which can be managed through the NoteNexus editor. For each paragraph, NoteNexus can identify related information using a vector database and _link_ it with the current paragraph through the NoteNexus explorer.

## How we built it
### Starting out
We started by planning out our system end-to-end, discussing core features which we wanted to incorporate into a notetaking tool. 

### Frontend
We decided building a browser-based application using React and Next.js. The frontend has access to our two apis: one for authentication, and one for recording notes.

The user's main interaction with the site is through the editor tab. The editor tab behaves like a Jupyter Notebook, where the cells are paragraphs. The reason for this decision choice is to limit the maximum context size for analysis and better summaries with Cohere.


### Backend
When a user saves a Note, new and updated paragraphs in that Note are sent to our api, built with Flask. Our Flask api is responsible for a variety of text-related tasks:
* Encoding paragraph contents into vector representations using Huggingface and SentenceTransformers.

* Storing plain text and their vector representations into our Elasticsearch cluster.

* Querying the Elasticsearch cluster for paragraph contents and identifying which paragraphs are most similar to a given text query.

* Querying the cohere summarization api to create a jist of what a group of related paragraphs are about.

* Users and notes are separated into a different database and server. The server is written in Golang and the database is MongoDB.

### Authentication
* Clerk handles user authentication with with OAuth connections

* After user authentication completes, a webhook to Clerk synchronizes the database state for future use. Ngrok is used to expose the local server to the public so that Clerk can communicate with the webhook.


## Challenges we ran into
- We had way too many ideas for features and tried to work on all of them instead of focusing on a core mvp and building upwards from there. We were very excited to try many different techniques for traversing through notes!
- it is not trivial to create a graph view with D3.js 😅
- Even though we have our back-end system working with all the summarization and paragraph linking, a small Next.js and React issue prevented us from implementing routing to the links we have. However, we still have a record of the paragraph and note associated with it

## Accomplishments that we're proud of
We built an app that students can actually go and use, which was what our goal was from the beginning! We're all avid notetakers so this project was really fun to work on from conception to implementation!

## What we learned
We learned how to use vector databases to organize data by their features which might not be readily apparent.

## What's next for NoteNexus
* Integrating a graph view to visualize and spot connections between notes from afar
* More features in the editor view to support things like markdown
* We'd like to expand on NoteNexus as a collaboration tool to allow friends and colleagues to find links between their notes.
