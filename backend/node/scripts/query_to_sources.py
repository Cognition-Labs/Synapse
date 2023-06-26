import os
import platform
import sys
import dotenv
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.document_loaders import DirectoryLoader
from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import BSHTMLLoader

"""
  - query_to_sources
    - Input: string
    - Output: JSON
      - GPT summary
      - list of sources
    - process:
      - init_database_if_needed
        - do zotero check
        - do is_db_changed check
          - last_modified_index
          - current_index
          - update_index
            - no_connection
              - return current_index and message for user to check connection
      - get_sources
        - get_sources_from_db
          - no_connection
            - return sources and message for user to check connection
"""

def get_zotero_path():
  """
  https://www.zotero.org/support/zotero_data
  macOS	
  /Users/<username>/Zotero
  Windows 7 and higher	
  C:/Users/<User Name>/Zotero
  Linux	
  ~/Zotero
  """
  # Get current OS
  current_os = platform.system()

  # Get username for the current user
  username = os.getlogin()

  # Define the base path for each operating system
  if current_os == "Windows":
      if platform.release() == "XP" or platform.release() == "2000":
          zotero_path = f"C:\\Documents and Settings\\{username}\\Zotero\\storage"
      else:
          zotero_path = f"C:\\Users\\{username}\\Zotero\\storage"
  elif current_os == "Darwin": # MacOS
      zotero_path = f"/Users/{username}/Zotero/storage"
  elif current_os == "Linux":
      zotero_path = f"~/Zotero/storage"
  else:
      zotero_path = None

  return zotero_path

ZOTERO_PATH = get_zotero_path()
# CURR_PATH = os.path.dirname(os.getcwd()) # Get out of the scripts folder
CURR_PATH = os.path.join(os.getcwd(), "node")
# PERSIST_DIR = os.path.join(CURR_PATH, "db") # Supplying a persist_directory will store the embeddings on disk
PERSIST_DIR = "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/db"
DOT_ENV_PATH = "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/backend/node/.env"
PYTHON_PATH = sys.argv[3]
dotenv.load_dotenv(DOT_ENV_PATH)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

# We're assuming that update_index.py has already been run

# Here we are using OpenAI embeddings but in future we will swap out to local embeddings
embedding = OpenAIEmbeddings(disallowed_special=())

# Get query from sys
query = sys.argv[2]

# Now we can load the persisted database from disk, and use it as normal.
vectordb = Chroma(persist_directory=PERSIST_DIR,
                  embedding_function=embedding)

retriever = vectordb.as_retriever()

# create the chain to answer questions
qa_chain = RetrievalQA.from_chain_type(llm=OpenAI(),
                                  chain_type="stuff",
                                  retriever=retriever,
                                  return_source_documents=True)

# break it down
# query = """Favorite representations
# - notations (Leibniz), automata, graphs (Bret victor), car recliner button
# - keep reading design of everyday things
# - Going from 1 to 0 registers through analogy (Python)
# - Mendeleev and the periodic table
# """

llm_response = qa_chain(query)

print(llm_response)