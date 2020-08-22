using Microsoft.AspNetCore.SignalR;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Calla.Hubs
{
    public class ChatHub : Hub
    {
        public async Task Join(string room)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, room)
                .ConfigureAwait(false);

        }

        public async Task SendMessage(string room, string user, string message)
        {
            await Clients.Group(room)
                .SendAsync("ReceiveMessage", user, message)
                .ConfigureAwait(false);
        }
    }
}
