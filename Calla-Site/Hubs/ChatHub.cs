using Microsoft.AspNetCore.SignalR;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Calla.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string room, string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", room, user, message)
                .ConfigureAwait(false);
        }
    }
}
