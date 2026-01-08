from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from app.core.config import settings

class DBAgent:
    def __init__(self):
        # Using the existing database configuration
        # Assuming postgres connection string is available in settings
        # If not, we construct it: postgresql://user:pass@host:port/db
        db_user = settings.DB_USER
        db_password = settings.DB_PASSWORD
        db_host = settings.DB_HOST
        db_port = settings.DB_PORT
        db_name = settings.DB_NAME
        
        self.db_uri = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        self.db = SQLDatabase.from_uri(self.db_uri)
        
        # Initialize LLM - attempting to use Gemini as per context (free tier preference)
        # Fallback to OpenAI if configured, or expect GOOGLE_API_KEY
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)

        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        
        self.agent_executor = create_sql_agent(
            llm=self.llm,
            toolkit=self.toolkit,
            verbose=True,
            handle_parsing_errors=True
        )

    def query(self, user_query: str) -> str:
        try:
            # Adding a system prompt wrapper to ensure safety and relevance
            prompt = f"""
            You are a helpful library assistant. You have access to the library database.
            Answer the user's question based strictly on the database content.
            If you cannot find the answer in the database, say so politely.
            Do not execute DML statements (INSERT, UPDATE, DELETE). Read-only access.
            
            User Question: {user_query}
            """
            response = self.agent_executor.invoke(prompt)
            return response.get("output", "I apologize, I couldn't process that query.")
        except Exception as e:
            return f"Error executing database query: {str(e)}"
