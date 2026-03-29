function Table(lobby) {
    return (
        <div className='lobby-bottom'>
                    <div className="lobby">
                                <h2>Players</h2>
                                <div className="error">
                                    {error && <p>{error}</p>}
                                </div>
                                <ul>
                                    {lobby?.players?.length > 0 ? lobby.players.map((player) => {
                                        return <li className='friend-list-item' key={player.id}>{player.username}</li>
                                    }) : <li className='empty-li'>No PLayers?</li  >}
                                </ul>
                                <ul>
                                    {lobby?.invites?.length > 0 ? lobby.invites.map((invite) => {
                                        return <li className='friend-list-item invite-list-item' key={invite.id}>{invite.username} (invited)</li>
                                    }) : null}
                                </ul>
                                <div className="button-holder">
                                    {addingPlayer
                                        &&  <form className='flex-row' onSubmit={invitePlayer}>
                                                <label for="username"></label>
                                                <input type="text" id="username" name="username"></input>
                                                <button className='go-button'>Go</button>
                                            </form>}
                                    {lobby?.players?.length < 2 &&
                                    <button onClick={toggleAddingPlayer} className='drop-down'>Invite Player</button>}
                                    {lobby?.owner?._id == user.userID && <>
                                        <button onClick={deleteLobby}>Delete Lobby</button>
                                        {lobby?.players?.length == 2 && <button onClick={play}>Play</button>}
                                        </>}
                                </div> 
                            </div>  
            </div>
    )
}