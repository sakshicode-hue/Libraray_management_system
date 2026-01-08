from app.agents.chat_agent import ChatAgent

# Singleton instance of the agent
agent = ChatAgent()

def process_chat(user_id: str, message: str):
    response = agent.handle_message(message)
    return {"response": response}
