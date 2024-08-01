import * as dotenv from 'dotenv'

dotenv.config()

class ChatGPTClass{
  queue = []; 
  optionsGPT = { model: "gpt-4o" };
  openai = undefined;

  constructor() {
    this.init().then();
  }

  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI(
        {
            apiKey: process.env.OPENAI_API_KEY
        }
    );
  };

  handleMsgChatGPT = async (body) => {
    const interaccionChatGPT = await this.openai.sendMessage(body, {
        conversationId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].conversationId,
        parentMessageId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].id,
      });
    this.queue.push(interaccionChatGPT);

    return interaccionChatGPT
  }
}

export { ChatGPTClass }