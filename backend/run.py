from api import app, api_instance

from api.routes.rag import chat_ns
api_instance.add_namespace(chat_ns, '/chat')

if __name__ == '__main__':
    app.run(debug=True)