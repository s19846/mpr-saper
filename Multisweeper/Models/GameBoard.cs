using System;
using System.Collections.Generic;
namespace Multisweeper.Models
{
    public class GameBoard
    {
        public GameBoard()
        {
            RowList = new List<Row>();
            for (int i=0;i<30;i++)
            {
                Row CurrRow = new Row();
                for (int j=0;j<30;j++)
                {
                    Box CurrBox = new Box()
                    {
                        X = j,
                        Y = i
                    };
                    CurrRow.BoxList.Add(CurrBox);
                }
                RowList.Add(CurrRow);
            }
        }

        public List<Row> RowList { get; set; }

        public Box GetBox(int x, int y)
        {
            return this.RowList[y].BoxList[x];
        }
    }

    public class Row
    {
        public List<Box> BoxList { get; set; }

        public Row()
        {
            BoxList = new List<Box>();
        }
    }

    public class Box
    {
        public int X { get; set; }
        public int Y { get; set; }
        public bool Mine { get; set; }
        public int SurroundingMines { get; set; }
    }
}
