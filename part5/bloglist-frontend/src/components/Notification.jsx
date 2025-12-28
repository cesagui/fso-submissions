const Notification = ({ message, isError }) => {
    if (!message){
        return null
    }
    if (isError){
        return (
            <div className = 'error'>
                {message}
            </div>
        )
    }
    return (
        <div className = 'notification'>
            {message}
        </div>
    )
    
}

export default Notification