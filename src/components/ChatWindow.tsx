type Message= {
  role: string,
  content: string,
}
type ChatWindowProps = {
    messages: Message[];
    onClickSendButton: () => void
};
  
export default ({messages, onClickSendButton}:ChatWindowProps) => {
  const messageList = messages.map((message, index) =>
  <div className={'message message-'+message.role} key={index}>
    <div className='message-role'>{message.role}</div>
    <div className='message-content'>{message.content}</div>
  </div>
  );
   return (
    <aside className='chat-window'>
        <h2>Chat Window</h2>
        <div className='message-container'>
          {messageList}
        </div>
        <button onClick={onClickSendButton} className='message-send-button'>Send</button>
    </aside>
  );
};
