﻿using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Multisweeper.Services;
using Multisweeper.Models;
using System.Text.Json;
using System.Collections.Generic;
using SQLite;
using Multisweeper.Entities;

namespace SignalRControl.Hubs
{
    public class MultiplayerHub : Hub
    {
        private SQLiteConnection sql;
        private GameBoardHandler handler;

        public MultiplayerHub(SQLiteConnection sql)
        {
            this.sql = sql;
            IRandomizer randomizer = new Randomizer();
            this.handler = new GameBoardHandler(randomizer);
        }

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
            this.handler.InitBoard(gameBoard);
            string serializedBoard;
            serializedBoard = JsonSerializer.Serialize(gameBoard);
            await Clients.All.SendAsync("StartGame", serializedBoard);
        }

        public async Task AddPlayer(string user)
        {
            await Clients.All.SendAsync("NewPlayerToList", user);
        }

        public async Task LostTheGame(string user, string score)
        {
            this.sql.Insert(new Score()
            {
                User = user,
                Points = score
            });
            await Clients.All.SendAsync("CoronateTheSucker", user);
        }
    }

    public static class UserHandler
    {
        public static List<string> ConnectedIds = new List<string>();
    }
}