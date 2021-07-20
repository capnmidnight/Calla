export interface IClient {

    /**
     * Connect to teleconferencing server
     **/
    connect(): Promise<void>;

    /**
     * Join a teleconferencing session.
     * @param roomName - the name of the room in which to find the other users in the teleconference.
     */
    join(roomName: string, enableTeleconference: boolean): Promise<void>;

    /**
     * Set the user identifier for the teleconferencing session.
     * @param userNameOrID - the name of the user joining the conference, or the id of the user joining the metadata channel.
     */
    identify(userNameOrID: string): Promise<void>;

    /**
     * Remove the current user from the teleconferencing session.
     **/
    leave(): Promise<void>;

    /**
     * Disconnect from the teleconferencing server.
     **/
    disconnect(): Promise<void>;
}