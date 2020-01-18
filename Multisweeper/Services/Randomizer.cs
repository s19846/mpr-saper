using System;
namespace Multisweeper.Services
{
    public interface IRandomizer
    {
        int generateRandomNumber();
    }

    public class Randomizer: IRandomizer
    {
        public Randomizer()
        {
        }

        public int generateRandomNumber()
        {
            Random RandomGenerator = new Random();
            return RandomGenerator.Next(1, 100);
        }
    }
}
