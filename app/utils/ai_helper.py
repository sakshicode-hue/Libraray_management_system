from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.schemas.ai_schema import AIIntent, IntentType
from app.cores.config import settings
import os
from typing import Optional

# Initialize Gemini Model
# Ensure GOOGLE_API_KEY is set in your environment variables
# model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=settings.GOOGLE_API_KEY, temperature=0)

class AIHelper:
    def __init__(self):
        try:
             # Fallback to os.environ if settings doesn't have it, or assume it's loaded in env
            api_key = getattr(settings, "GOOGLE_API_KEY", os.environ.get("GOOGLE_API_KEY"))
            if not api_key:
                print("Warning: GOOGLE_API_KEY not found. AI features may not work.")
                self.llm = None
            else:
                self.llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key, temperature=0)
        except Exception as e:
            print(f"Error initializing AI: {e}")
            self.llm = None

    async def detect_intent(self, user_message: str) -> AIIntent:
        if not self.llm:
            return AIIntent(intent=IntentType.UNKNOWN, confidence=0.0)

        parser = PydanticOutputParser(pydantic_object=AIIntent)

        template = """
        You are an AI assistant for a Library Management System.
        Your task is to analyze the user's message and extract the intent and relevant entities.

        Available Intents:
        - check_availability: User wants to know if a book is available. Entities: 'book_title' (str), 'author' (optional str).
        - fetch_fines: User asks about their fines or dues. Entities: None.
        - borrowing_history: User asks about what books they borrowed previously. Entities: None.
        - recommendation: User asks for book recommendations. Entities: 'genre' (optional str), 'topic' (optional str).
        - general_query: General questions about the library (not specific user data).
        - unknown: If the message matches none of the above.

        User Message: {message}

        {format_instructions}
        """

        prompt = PromptTemplate(
            template=template,
            input_variables=["message"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )

        chain = prompt | self.llm | parser

        try:
            result = await chain.ainvoke({"message": user_message})
            return result
        except Exception as e:
            print(f"AI Intent Detection Failed: {e}")
            return AIIntent(intent=IntentType.UNKNOWN, confidence=0.0)

    async def generate_response(self, user_message: str, context: str) -> str:
        if not self.llm:
            return "AI service is currently unavailable."
        
        template = """
        You are a helpful Library Assistant.
        User Message: {message}
        
        Context Information (from database):
        {context}
        
        Provide a friendly, concise answer based ONLY on the context provided.
        If the context indicates a failure or emptiness, succinctly explain why.
        Do not make up facts.
        """
        
        prompt = PromptTemplate(template=template, input_variables=["message", "context"])
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"message": user_message, "context": context})
            return response.content
        except Exception as e:
            return "I'm sorry, I couldn't generate a response."

ai_helper = AIHelper()

def generate_reminder_message(txn: dict) -> str:
    """Generate a simple reminder string for a transaction"""
    book = txn.get("book_details", {}).get("title", "Unknown Book")
    due_date = txn.get("due_date", "Unknown Date")
    return f"Reminder: The book '{book}' is due on {due_date}. Please return it to avoid fines."
