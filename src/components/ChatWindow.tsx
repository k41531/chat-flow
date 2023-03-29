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
        <button onClick={onClickSendButton} className='message-send-button'>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
         <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
         <path d="M10 14l11 -11"></path>
         <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
      </svg> 
        </button>
    </aside>
  );
};
