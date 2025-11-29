const Notification = ({message, isError})  => {
    const generalStyle = {
        
        fontStyle: 'italic',
        fontSize: '20px',
        backgroundColor: 'lightgrey',
        borderWidth: '2px',
        borderRadius: '4px',
        borderStyle: 'solid',
        padding: '4px',
    }
    let notificationStyle = {}
    if (isError) {
        notificationStyle = {
            borderColor : 'red',
            color : 'red'
        }
    } else {
        notificationStyle = {
            borderColor : 'green',
            color : 'green'
        }
    }
    if (message != null) {
        return (
        <div style = {{...notificationStyle, ...generalStyle}} >{message}</div>
        )
    }
    return <></>
    
}

export default Notification
