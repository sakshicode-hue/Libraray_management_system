from app.schemas.ai_schema import ChatRequest, ChatResponse, IntentType
from app.utils.ai_helper import ai_helper
from app.controllers import book_controller, fine_controller, transaction_controller, reservation_controller
import json



async def handle_chat_request(request: ChatRequest) -> ChatResponse:
    # 1. Detect Intent
    intent_result = await ai_helper.detect_intent(request.message)
    intent = intent_result.intent
    entities = intent_result.entities
    
    context_data = ""
    system_response = ""
    
    try:
        if intent == IntentType.CHECK_AVAILABILITY:
            book_title = entities.get("book_title")
            if book_title:
                # Search for the book
                search_results = await book_controller.get_books(search=book_title, page_size=5)
                books = search_results["books"]
                if books:
                    context_data = f"Found books: {json.dumps(books, default=str)}"
                else:
                    context_data = "No books found matching that title."
            else:
                context_data = "User did not specify a book title."

        elif intent == IntentType.FETCH_FINES:
            # Requires user_id. For now, we assume user_id is passed or handled via auth context in a real scenario.
            # Here we mock or check if request has user_id
            if request.user_id:
                # fines = await fine_controller.get_member_fines(request.user_id) # Hypothetical function
                fines_data = await fine_controller.list_fines(member_id=request.user_id)
                context_data = f"User fines summary: {json.dumps(fines_data, default=str)}"
            else:
                context_data = "I need to know who you are to check fines. (User ID missing)"

        elif intent == IntentType.BORROWING_HISTORY:
            if request.user_id:
                # history = await transaction_controller.get_user_transactions(request.user_id) 
                history_data = await transaction_controller.get_transaction_history(member_id=request.user_id)
                context_data = f"Borrowing history: {json.dumps(history_data['transactions'], default=str)}"
            else:
                context_data = "User ID missing for history check."

        elif intent == IntentType.RECOMMENDATION:
            # Simple recommendation based on recent books or random if no history
            # For now, let's fetch popular books
            popular_books = await book_controller.get_books(page_size=5) # simplified
            context_data = f"Recommended books: {json.dumps(popular_books['books'], default=str)}"
            
        elif intent == IntentType.GENERAL_QUERY:
            context_data = "General library query. Answer based on general knowledge."

        elif intent == IntentType.UNKNOWN:
            context_data = "Intent could not be clearly understood."

        # 2. Generate Response
        system_response = await ai_helper.generate_response(request.message, context_data)

    except Exception as e:
        print(f"Error processing intent {intent}: {e}")
        system_response = "I encountered an error while processing your request."
        
    return ChatResponse(
        response=system_response,
        conversation_id=request.conversation_id,
        intent=intent,
        data=entities
    )
