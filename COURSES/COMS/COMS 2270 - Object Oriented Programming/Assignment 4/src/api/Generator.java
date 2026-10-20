package api;

/**
 * Abstraction of a generator for game pieces in a Tetris-like
 * video game.  
 */
public interface Generator
{
  /**
   * Returns a new Piece instance according to this generator's 
   * strategy.
   * @param width
   *   the width the game grid
   * @return 
   *   a new Piece 
   */
  Piece getNext(int width);
  
  /**
   * Returns one of the possible Icon types for this generator,
   * selected at random.
   * @return
   *   randomly selected Icon
   */
  Icon randomIcon();
}
