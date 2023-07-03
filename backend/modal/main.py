import os
import json
import dotenv
import modal
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain
import openai

PERSIST_DIR = "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/modal/embeddings"
DOT_ENV_PATH = "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/modal/.env"

dotenv.load_dotenv(DOT_ENV_PATH)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

image = modal.Image.debian_slim().pip_install_from_requirements("requirements.txt")

mounts = [
    modal.Mount.from_local_file(".env", remote_path=DOT_ENV_PATH),
    modal.Mount.from_local_dir("embeddings", remote_path=PERSIST_DIR),
]

stub = modal.Stub(name="Synapse", mounts=mounts, image=image)

def load_vectordb(db_name):
    embedding = OpenAIEmbeddings(disallowed_special=())
    vectordb = Chroma(persist_directory=os.path.join(PERSIST_DIR, db_name, 'db'), embedding_function=embedding)
    return vectordb.as_retriever()

def create_prompt_template():
#     template = """
# You are a creativity engine. You will show a reduced representation of a corpus to draw out connections with reference to the original query of your pupil.
# The query is a snapshot of the pupil's mind. DO NOT include the query in the output. You do not want to reveal the pupil's mind to the world.

# The following is the query:
# "{query}"

# The following is the corpus:
# "{corpus}"

# Use extreme patchwriting and mosaic writing as your style, maximally using exact quotations. Use quotes ("") and ellipses (...) to delineate between quotations of the corpus.
# Use the quotations as your canvas instead of using your own words. Do this to help the pupil have creative thoughts based on a reduced representation of the original text with reference to the given query.
# Only give the resultant patchwork and no extra explanations. Let your work speak for itself."""

    template = """
You are a creativity engine. You will show a reduced representation of a corpus to draw out connections for your pupil.

The following is the corpus:
"{corpus}"

Use extreme patchwriting and mosaic writing as your style, maximally using exact quotations. Use quotes ("") and ellipses (...) to delineate between quotations of the corpus.
Use the quotations as your canvas instead of using your own words. Do this to help the pupil have creative thoughts based on a reduced representation of the original text with reference to the given query.
Only give the resultant patchwork and no extra explanations. Let your work speak for itself."""
    # return PromptTemplate(template=template, input_variables=['query','corpus'])
    return PromptTemplate(template=template, input_variables=['corpus'])

def create_llm_chain(prompt):
    # llm = OpenAI(model='gpt-3.5-turbo')
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1, max_tokens=100, model_kwargs={'presence_penalty': 0.4})
    return LLMChain(prompt=prompt, llm=llm)

def process_documents(docs, llm_chain, query):
    for doc in docs:
        corpus = doc['page_content']
        # input = {'query' : query, 'corpus' : corpus}
        corpus = corpus.replace("\n", " ").replace('"', "").replace("'", "")
        input = {'corpus' : corpus}
        output = llm_chain.run(input)
        doc['page_content'] = output

@stub.function(cpu=2, memory=2048, container_idle_timeout=300, keep_warm=1)
@modal.web_endpoint(method="GET")
def run_query(query: str, db_name: str):
    retriever = load_vectordb(db_name)
    docs = retriever.get_relevant_documents(query=query)
    docs = [json.loads(doc.json()) for doc in docs]
    prompt = create_prompt_template()
    llm_chain = create_llm_chain(prompt)
    process_documents(docs, llm_chain, query)
    # print(docs)
    return docs
