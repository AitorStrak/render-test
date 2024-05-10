const Notification = ({ message, messageError }) => {
  if (message === null && messageError === null) {
    return null
  }else{
    if (message) {
      return (
        <div className="success">
          {message}
        </div>
      );
    } else if (messageError) {
      return (
        <div className="error">
          {messageError}
        </div>
      );
    };
  };        
};
export default Notification;
