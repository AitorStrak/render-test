const NotificationError = ({ messageError }) => {
    if (messageError === null) {
      return null
    } else if (messageError) {
        return (
          <div className="messageError">
            {messageError}
          </div>
        );
      };
  };
  export default NotificationError;