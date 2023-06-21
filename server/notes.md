# Server

Make a new env with conda so that you can have a requirements.txt at the end of it

https://fastapi.tiangolo.com/tutorial/

```sh
conda create -n synapse
conda activate synapse
pip install "fastapi[all]"
touch main.py
…
uvicorn main:app --reload
```

You also have to select the python interpreter in vscode

main.py

- You can see the docs by going to /docs
  - automatically generates schema with an abstract definition
- create FastAPI app instance
- use it
- create a path operation

  - While building an API, the "path" is the main way to separate "concerns" and "resources".
  - "Operation" here refers to one of the HTTP "methods".
    - One of:
      - POST: to create data.
      - GET: to read data.
      - PUT: to update data.
      - DELETE: to delete data.

Shrey made his code very clean with structure and comments. I will to do the same.

- he has a core folder with the main code
- he has a preprocessing script
- he has a main.py with only high level code
- he has envs

Modal

- What is Modal
  - let’s you run code in cloud
- _image_ to make context
- _mount_ to add local files
- create a _stub_
- have functions in the stub
- create an entry point for the stub
  - like main function
- run the stub

Make .env

Stateful server:

- Background
  - We need to make a server that does two main things
    - API
      - We need endpoints that take in either a pdf of html input
      - Returns a processed output
    - Storage
      - We need to cache processed outputs if we get the same input
      - This cached processed output will also be used for later logic, so this needs to be extensible.
      - This will need to go to Pinecone

Server Logic

- takes input
  - check if duplicate input
    - if so take saved version and return
    - else continue
  - case pdf
    - OCR to markdown
  - case html
    - bs4 to markdown
- return Langchain vectordbqa

Langchain

- retriever
  - use faiss
    - save it locally as a vector store
      - merge many vector stores
    - make mvp with just loading what we have
    - https://python.langchain.com/docs/modules/data_connection/vectorstores/integrations/faiss

Embeddings are worse if you don't have it finetuned over your corpus. Need to look at options:

- finetune embedding over your corpus
- use predefined embeddings for your field and pick the best one as a parameter

  - pubmedqa
  - openai
    - for writing and general
  - lawqa

- Handle uploaded PDF and OpenAI API key
- Extract texts from PDF and create text embeddings out of it using OpenAI embeddings.
- Store vector embeddings in the ChromaDB vector store.
- Create a Conversational Retrieval chain with Langchain.
- Create embeddings of queried text and perform a similarity search over embedded documents.
- Send relevant documents to the OpenAI chat model (gpt-3.5-turbo).
- Fetch the answer and stream it on chat UI.
- Render relevant PDF page on Web UI.

Non-issue

- just get it to work for openai embeddings

Stuff:
hybrid search

- https://www.pinecone.io/learn/hybrid-search-intro/
  code search
- https://github.com/BloopAI/bloop
- https://observablehq.com/@asg017/introducing-sqlite-vss
- https://github.com/pgvector/pgvector

Prompt engineering

- turn regular into questions so that there are better search results

Server gets embeddings:
