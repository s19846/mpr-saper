using System;
using Multisweeper.Models;
using System.Collections.Generic;

namespace Multisweeper.Services
{
    public class GameBoardHandler
    {
        public GameBoard InitBoard(GameBoard board)
        {
            this.PopulateBoardWithMines(board);
            return board;
        }

        private void PopulateBoardWithMines(GameBoard board)
        {
            foreach (Row row in board.RowList)
            {
                foreach (Box box in row.BoxList)
                {
                    bool isMine = this.GenerateMine();
                    if (isMine)
                    {
                        box.Mine = isMine;
                        List<Box> surrBoxList = this.GetSurroundingBoxes(board, box);

                        foreach (Box surrBox in surrBoxList)
                        {
                            surrBox.SurroundingMines++;
                        }
                    }
                }
            }
        }

        private Boolean GenerateMine()
        {
            Random RandomGenerator = new Random();
            int RandNum = RandomGenerator.Next(1, 100);
            return RandNum <= 13;
        }

        private List<Box> GetSurroundingBoxes(GameBoard board, Box Box)
        {
            List<Box> SurroundingBoxList = new List<Box>();
            int X = Box.X;
            int Y = Box.Y;

            if (X > 0)
            {
                if (Y > 0)
                {
                    SurroundingBoxList.Add(board.GetBox(X - 1, Y - 1));
                }

                SurroundingBoxList.Add(board.GetBox(X - 1, Y));

                if (Y < 29)
                {
                    SurroundingBoxList.Add(board.GetBox(X - 1, Y + 1));
                }
            }

            if (Y > 0)
            {
                SurroundingBoxList.Add(board.GetBox(X, Y - 1));
            }

            SurroundingBoxList.Add(board.GetBox(X, Y));

            if (Y < 29)
            {
                SurroundingBoxList.Add(board.GetBox(X, Y + 1));
            }

            if (X < 29)
            {
                if (Y > 0)
                {
                    SurroundingBoxList.Add(board.GetBox(X + 1, Y - 1));
                }

                SurroundingBoxList.Add(board.GetBox(X + 1, Y));

                if (Y < 29)
                {
                    SurroundingBoxList.Add(board.GetBox(X + 1, Y + 1));
                }
            }

            return SurroundingBoxList;
        }
    }
}
