# Backend/verify_chatbot.py
import sys
import os

# Ensure the app module is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.chat_agent import ChatAgent

def test_chat():
    print("Initializing Chat Agent...")
    try:
        agent = ChatAgent()
        
        test_queries = [
            "Hello, who are you?",
            "Do you have the book '1984'?",
            "What is the fine for an overdue book?",
            "Tell me a joke."
        ]
        
        print("\n--- Starting Verification ---")
        for query in test_queries:
            print(f"\nUser: {query}")
            response = agent.handle_message(query)
            print(f"Bot: {response}")
            
        print("\n--- Verification Complete ---")
        
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_chat()
