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
  - update_index
    - Input: None
    - Output: Message
      - "Index updated"
      - "No connection"
    - process:
      - do empty check
        - init_database
          - chroma
        - init_prev
      - merge_index
        - get_prev
        - get_current
        - add_new
          - embed
          - merge
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
PERSIST_DIR = os.path.join(CURR_PATH, "db") # Supplying a persist_directory will store the embeddings on disk
DOT_ENV_PATH = "/Users/danielgeorge/Documents/work/ml/hypolab/Synapse/server/node/.env"
PYTHON_PATH = sys.argv[3]
dotenv.load_dotenv(DOT_ENV_PATH)
# os.environ["OPENAI_API_KEY"] = "put your own key"

if ZOTERO_PATH is None:
    print("Invalid OS")
    exit(1)

# Check if the path is of a real directory
if not os.path.isdir(ZOTERO_PATH):
    print("Zotero not connected")
    exit(1)

# List all directories in a path using os.listdir
base_path = ZOTERO_PATH
directories = os.listdir(base_path)

# Empty check
if len(directories) == 0:
    print("No files found")
    exit(1)

# Check for PDFs and obtain the paths
# Check for snapshots (html files) and obtain the paths
pdf_paths = []
snapshot_paths = []
print("Going through Zotero files")
for directory in directories:
    # Get the full path of the directory
    full_path = os.path.join(base_path, directory)
    if os.path.isdir(full_path):
      # List all files in a path using os.listdir
      files = os.listdir(full_path)
      for file in files:
          # Get the full path of the file
          full_file_path = os.path.join(full_path, file)
          # Check if the path is of a real file
          # Check if the file is a PDF
          if file.endswith(".pdf"):
              pdf_paths.append(full_file_path)
          # Check if the file is a snapshot
          elif file.endswith(".html"):
              snapshot_paths.append(full_file_path)

# Check if there are no PDFs and no snapshots
if len(pdf_paths) == 0 and len(snapshot_paths) == 0:
    print("No PDFs or snapshots found")
    exit(1)
  
# Check dirty_index at CURR_PATH/dirty_index/dirty_index.txt
print("Checking dirty index")
dirty_index_path = os.path.join(CURR_PATH, "dirty_index", "dirty_index.txt")
print(dirty_index_path)
dirty_index = set()
# Check if the path is of a real file. If it is, add all lines to the dirty_index set
if os.path.isfile(dirty_index_path):
    # Read the file
    with open(dirty_index_path, "r") as dirty_index_file:
        # Read all lines
        lines = dirty_index_file.readlines()
        # Add all lines to the dirty_index set
        for line in lines:
            dirty_index.add(line.strip())

# Take away the dirty_index from the pdf_paths and snapshot_paths
pdf_paths = set(pdf_paths) - dirty_index
snapshot_paths = set(snapshot_paths) - dirty_index

# Check if there are no PDFs and no snapshots
if len(pdf_paths) == 0 and len(snapshot_paths) == 0:
    print("Index unchanged")
    exit(0)

# Process the PDFs
documents = []
print(f"Processing {len(pdf_paths)} PDFs")
for pdf_path in pdf_paths:
    # Load the document
    document = PyPDFLoader(pdf_path).load()
    # Add the document to the list of documents
    documents += document

print(f"Processing {len(snapshot_paths)} snapshots")
for snapshot_path in snapshot_paths:
    # Load the document
    document = BSHTMLLoader(snapshot_path).load()
    # Add the document to the list of documents
    documents += document
    break

print("Splitting documents")
# Splitting the text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(documents)

# Check if the db exists by seeing if CURR_PATH/db is empty or does not exist
db_path = os.path.join(CURR_PATH, "db")

# Here we are using OpenAI embeddings but in future we will swap out to local embeddings
embedding = OpenAIEmbeddings(disallowed_special=())

# Check if the path is of a real directory
if not os.path.isdir(db_path):
    # Create the directory
    os.mkdir(db_path)
    print("Creating database")
    # Create the database
    vectordb = Chroma.from_documents(documents=texts,
                                 embedding=embedding,
                                 persist_directory=PERSIST_DIR)

else:
    # Load the database
    vectordb = Chroma(persist_directory=PERSIST_DIR, embedding_function=embedding)
    vectordb.add_documents(texts)

# Check if dirty_index.txt exists
print("Updating dirty index")
if not os.path.isfile(dirty_index_path):
    # Create the file
    # Make a file at CURR_PATH/dirty_index/dirty_index.txt
    with open(dirty_index_path, "w") as dirty_index_file:
        # Write all paths to the file with a newline
        for pdf_path in pdf_paths:
            dirty_index_file.write(pdf_path + "\n")
        for snapshot_path in snapshot_paths:
            dirty_index_file.write(snapshot_path + "\n")
# Add new paths to the dirty_index
else:
    # Append to the file
    with open(dirty_index_path, "a") as dirty_index_file:
        # Write all paths to the file with a newline
        for pdf_path in pdf_paths:
            dirty_index_file.write(pdf_path + "\n")
        for snapshot_path in snapshot_paths:
            dirty_index_file.write(snapshot_path + "\n")

