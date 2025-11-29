const Notification = ({message})  => {
    const notificationStyle = {
        color: 'green',
        fontStyle: 'italic'
    }
  
    return (
        <div style = {notificationStyle} >{message}</div>
    )
}

export default Notification
