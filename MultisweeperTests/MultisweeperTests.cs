using System;
using Xunit;
using Multisweeper.Services;
using Multisweeper.Models;
using Moq;
using FluentAssertions;

namespace MultisweeperTests
{
    public class BoardGameTest
    {
        [Fact]
        public void GeneratesSameEmptyBoardEveryTimeTest()
        {
            int numToReturn = 1;
            var randomizerMock = new Mock<IRandomizer>();
            randomizerMock
                .Setup(x => x.generateRandomNumber())
                .Returns(numToReturn);

            GameBoardHandler handler = new GameBoardHandler(randomizerMock.Object);

            GameBoard firstBoard = new GameBoard();
            GameBoard secondBoard = new GameBoard();

            handler.InitBoard(firstBoard);
            handler.InitBoard(secondBoard);

            firstBoard.Should().BeEquivalentTo(secondBoard);
        }

        [Fact]
        public void GeneratesSameFullBoardEveryTimeTest()
        {
            int numToReturn = 99;
            var randomizerMock = new Mock<IRandomizer>();
            randomizerMock
                .Setup(x => x.generateRandomNumber())
                .Returns(numToReturn);

            GameBoardHandler handler = new GameBoardHandler(randomizerMock.Object);

            GameBoard firstBoard = new GameBoard();
            GameBoard secondBoard = new GameBoard();

            handler.InitBoard(firstBoard);
            handler.InitBoard(secondBoard);

            firstBoard.Should().BeEquivalentTo(secondBoard);
        }
    }
}
