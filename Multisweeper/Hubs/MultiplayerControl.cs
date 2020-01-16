using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Multisweeper.Services;
using Multisweeper.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace SignalRControl.Hubs
{
    public class MultiplayerHub : Hub
    {
        public GameBoard currentBoard;

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendClick(string x, string y)
        {
            await Clients.All.SendAsync("ReceiveClick", x, y);
        }

        public async Task SendGame()
        {
            GameBoard gameBoard = new GameBoard();
            GameBoardHandler gameBoardHandler = new GameBoardHandler();
            gameBoardHandler.InitBoard(gameBoard);
            this.currentBoard = gameBoard;
            string serializedBoard;
            serializedBoard = JsonSerializer.Serialize(gameBoard);
            await Clients.All.SendAsync("StartGame", serializedBoard);
        }

        public async Task AddPlayer(string user)
        {
            await Clients.All.SendAsync("NewPlayerToList", user);
        }

        public async Task LostTheGame(string user)
        {
            await Clients.All.SendAsync("CoronateTheSucker", user);
        }
    }

    public static class UserHandler
    {
        public static List<string> ConnectedIds = new List<string>();
    }
}