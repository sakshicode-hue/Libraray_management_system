from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from app.agents.db_agent import DBAgent

class ChatAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)
        self.db_agent = DBAgent()
        
        # Intent Classification Prompt
        self.intent_template = """
        Classify the following user input into one of two categories: DATABASE_QUERY or GENERAL_CHAT.
        
        DATABASE_QUERY: Questions asking about books, authors, availability, fines, user details, or anything specific to the library's data.
        GENERAL_CHAT: Greetings, pleasantries, philosophical questions, or requests for creative writing unrelated to library data lookup.
        
        Return ONLY the category name.
        
        User Input: {input}
        Category:
        """
        self.intent_prompt = PromptTemplate(template=self.intent_template, input_variables=["input"])
        self.intent_chain = self.intent_prompt | self.llm | StrOutputParser()

        # General Chat Prompt
        self.chat_template = """
        You are a friendly and helpful Library AI assistant.
        Engage in polite conversation with the user.
        If they ask about library rules generally, you can answer.
        Do not make up facts about specific books in the inventory; guide them to ask specific queries if they want to check stock.
        
        User Input: {input}
        Response:
        """
        self.chat_prompt = PromptTemplate(template=self.chat_template, input_variables=["input"])
        self.chat_chain = self.chat_prompt | self.llm | StrOutputParser()

    def handle_message(self, user_in: str) -> str:
        try:
            # 1. Classify Intent
            intent = self.intent_chain.invoke({"input": user_in}).strip().upper()
            
            # 2. Route Request
            if "DATABASE_QUERY" in intent:
                return self.db_agent.query(user_in)
            else:
                return self.chat_chain.invoke({"input": user_in})
        except Exception as e:
            return f"I encountered an error processing your request: {str(e)}"
