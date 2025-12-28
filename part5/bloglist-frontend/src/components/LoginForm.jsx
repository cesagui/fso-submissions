const LoginForm = ({
    handleSubmit,
    handleUserChange,
    handlePasswordChange,
    username,
    password
}) => {
    return (
        <div>
            <h2>log in to application</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						username
						<input
							type="text"
							value={username}
							onChange={handleUserChange}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
        </div>
    )
}

export default LoginForm
