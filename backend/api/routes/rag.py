"""
RAG Chatbot Routes
Place this file at: backend/api/routes/rag.py
"""

import sys
import os

# Add project root to Python path to access RAG folder
# Current file: backend/api/routes/rag.py
# Project root: ../../../ (go up 3 levels to Crowd-Funding/)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from flask_restx import Resource, Namespace, fields
from flask import request
from api.helpers import rag_helper
from RAG import chatbot_prod

# Create namespace
chat_ns = Namespace('chat', description='Chat operations')

# Define API models for Swagger documentation
chat_input = chat_ns.model('ChatInput', {
    'user_id': fields.Integer(required=True, description='User ID'),
    'message': fields.String(required=True, description='User message')
})

chat_output = chat_ns.model('ChatOutput', {
    'status': fields.String(description='Response status'),
    'reply': fields.String(description='Bot reply'),
    'error': fields.String(description='Error message if any')
})


@chat_ns.route('')
class ChatResource(Resource):
    @chat_ns.expect(chat_input)
    @chat_ns.marshal_with(chat_output)
    def post(self):
        """Send a message to the chatbot"""
        try:
            data = request.get_json()
            
            if not data:
                return {"status": "error", "error": "No JSON data provided"}, 400
            
            user_id = data.get("user_id")
            message = data.get("message")
            
            if not user_id:
                return {"status": "error", "error": "user_id is required"}, 400
                
            if not message or not message.strip():
                return {"status": "error", "error": "message is required"}, 400

            # Store user message
            rag_helper.add_message(user_id=user_id, message=message, role="User")

            # Get conversation history
            chat_history = rag_helper.get_chat_history(user_id=user_id, limit=10)

            # Generate response
            reply = chatbot_prod.get_chatbot_response(
                user_message=message, 
                chat_history=chat_history
            )

            # Store assistant response
            rag_helper.add_message(user_id=user_id, message=reply, role="Assistant")

            return {"status": "success", "reply": reply}, 200

        except Exception as e:
            print(f"Error in chat endpoint: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"status": "error", "error": str(e)}, 500


@chat_ns.route('/warmup')
class WarmupResource(Resource):
    def get(self):
        """Warmup endpoint to pre-load vector database"""
        try:
            from RAG import chatbot_prod
            # Trigger lazy loading
            chatbot_prod.get_vectorstore()
            return {"status": "success", "message": "Chatbot warmed up successfully"}, 200
        except Exception as e:
            print(f"Error warming up chatbot: {str(e)}")
            return {"status": "error", "error": str(e)}, 500


@chat_ns.route('/history/<int:user_id>')
class ChatHistoryResource(Resource):
    def get(self, user_id):
        """Get chat history for a user"""
        try:
            limit = request.args.get("limit", type=int)
            history = rag_helper.get_chat_history_with_timestamps(
                user_id=user_id, 
                limit=limit
            )
            return {"status": "success", "history": history}, 200
        except Exception as e:
            print(f"Error retrieving history: {str(e)}")
            return {"status": "error", "error": str(e)}, 500
    
    def delete(self, user_id):
        """Delete chat history for a user"""
        try:
            result = rag_helper.delete_chat_history(user_id=user_id)
            return {"status": "success", "message": result}, 200
        except Exception as e:
            print(f"Error deleting history: {str(e)}")
            return {"status": "error", "error": str(e)}, 500