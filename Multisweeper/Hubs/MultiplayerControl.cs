using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRControl.Hubs
{
    public class MultiplayerHub : Hub
    {
        public async Task SendClick(string user, int x, int y)
        {
            await Clients.All.SendAsync("ReceiveClick", user, x, y);
        }

        public async Task GetGame(string[] users)
        {
            await Clients.All.SendAsync("StartGame", users);
        }
    }
}