using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRControl.Hubs
{
    public class MultiplayerHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}