using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace Calla.Hubs
{

    public interface IUserStateHubClient
    {
        Task UserPosed(string fromUserID, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
        Task UserPointer(string fromUserID, string name, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
        Task SetAvatarEmoji(string fromUserID, string emoji);
        Task AvatarChanged(string fromUserID, string url);
        Task Emote(string fromUserID, string emoji);
        Task Chat(string fromUserID, string text);
        Task RequestPose(string fromUserID);
        Task PoseResponse(string fromUserID, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
    }

    public interface IUserStateHubServer
    {
        Task Join(string roomName);
        void Identify(string userID);
        Task Leave();
        Task UserPosed(float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
        Task UserPointer(string name, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
        Task SetAvatarEmoji(string emoji);
        Task AvatarChanged(string url);
        Task Emote(string emoji);
        Task Chat(string text);
        Task<bool> RequestPose(string toUserID);
        Task PoseResponse(string toUserID, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz);
    }

    public class CallaUserStateHub : Hub<IUserStateHubClient>, IUserStateHubServer
    {
        private static readonly Dictionary<string, string> connections = new Dictionary<string, string>();
        private static void AddUser(string userID, string connectionID)
        {
            lock (connections)
            {
                if (!connections.ContainsKey(userID))
                {
                    connections.Add(userID, connectionID);
                }
            }
        }

        private static void RemoveUser(string userID)
        {
            lock (connections)
            {
                if (connections.ContainsKey(userID))
                {
                    connections.Remove(userID);
                }
            }
        }

        private static string GetUser(string userID)
        {
            string connectionID = null;
            lock (connections)
            {
                if (connections.ContainsKey(userID))
                {
                    connectionID = connections[userID];
                }
            }

            return connectionID;
        }

        private const string FROM_USER_ID_KEY = "userID";
        private const string ROOM_NAME_KEY = "roomName";

        private bool HasFromUserID => Context.Items.ContainsKey(FROM_USER_ID_KEY);
        private string FromUserID
        {
            get
            {
                return Context.Items[FROM_USER_ID_KEY] as string;
            }
            set
            {
                Context.Items[FROM_USER_ID_KEY] = value;
            }
        }

        private bool HasRoomName => Context.Items.ContainsKey(ROOM_NAME_KEY);
        private string RoomName
        {
            get
            {
                return Context.Items[ROOM_NAME_KEY] as string;
            }
            set
            {
                Context.Items[ROOM_NAME_KEY] = value;
            }
        }

        public void Identify(string userID)
        {
            FromUserID = userID;
            AddUser(userID, Context.ConnectionId);
        }

        public async Task Join(string roomName)
        {
            RoomName = roomName;
            await Groups
                .AddToGroupAsync(Context.ConnectionId, roomName)
                .ConfigureAwait(false);
        }

        public async Task Leave()
        {
            if (HasRoomName)
            {
                await Groups
                    .RemoveFromGroupAsync(Context.ConnectionId, RoomName)
                    .ConfigureAwait(false);
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (HasFromUserID)
            {
                RemoveUser(FromUserID);
            }

            await base
                .OnDisconnectedAsync(exception)
                .ConfigureAwait(false);
        }

        public async Task<bool> RequestPose(string toUserID)
        {
            if (!HasRoomName || !HasFromUserID)
            {
                return false;
            }

            var toUserConnectionID = GetUser(toUserID);
            if (toUserConnectionID is null)
            {
                return false;
            }

            await Clients.Client(toUserConnectionID)
                .RequestPose(FromUserID)
                .ConfigureAwait(false);

            return true;
        }

        public async Task PoseResponse(string toUserID, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz)
        {
            if (HasRoomName && HasFromUserID)
            {
                var toUserConnectionID = GetUser(toUserID);
                if (toUserConnectionID is object)
                {
                    await Clients.Client(toUserConnectionID)
                        .PoseResponse(FromUserID, px, py, pz, fx, fy, fz, ux, uy, uz)
                        .ConfigureAwait(false);
                }
            }
        }

        public async Task UserPosed(float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .UserPosed(FromUserID, px, py, pz, fx, fy, fz, ux, uy, uz)
                    .ConfigureAwait(false);
            }
        }

        public async Task UserPointer(string name, float px, float py, float pz, float fx, float fy, float fz, float ux, float uy, float uz)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .UserPointer(FromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz)
                    .ConfigureAwait(false);
            }
        }

        public async Task SetAvatarEmoji(string emoji)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .SetAvatarEmoji(FromUserID, emoji)
                    .ConfigureAwait(false);
            }
        }

        public async Task AvatarChanged(string url)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .AvatarChanged(FromUserID, url)
                    .ConfigureAwait(false);
            }
        }

        public async Task Emote(string emoji)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .Emote(FromUserID, emoji)
                    .ConfigureAwait(false);
            }
        }

        public async Task Chat(string msg)
        {
            if (HasRoomName && HasFromUserID)
            {
                await Clients
                    .OthersInGroup(RoomName)
                    .Chat(FromUserID, msg)
                    .ConfigureAwait(false);
            }
        }
    }
}
