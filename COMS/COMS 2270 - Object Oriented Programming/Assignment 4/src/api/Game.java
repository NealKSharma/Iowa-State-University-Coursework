package api;

import java.util.List;

/**
 * Interface for a Tetris-like game. Implementations of this 
 * interface should maintain all aspects of the game state.  The state
 * consists of a grid of Icon objects representing occupied 
 * and unoccupied positions, plus a current Piece whose position is 
 * normally updated by the step() method and can be altered by the 
 * transform(), shiftDown(), shiftLeft(), and shiftRight() methods.
 * An additional part of the game state is the status that is returned by 
 * each invocation of the step() method.  The status values are described 
 * in detail in the GameStatus documentation.
 */
public interface Game
{
  /**
   * Transition the game through one discrete step.  A step may consist of
   * <ul>
   *   <li>shifting the current piece down by one cell
   *   <li>changing the status to COLLAPSING when when the current shape cannot
   *       be dropped further and completes a collapsible set (e.g.,
   *       in a standard Tetris game, a collapsible set would be a
   *       completed horizontal row)
   *   <li>changing the status to STOPPED when the current piece cannot
   *       be dropped further, but does not complete a collapsible set
   *   <li>changing the status to NEW_SHAPE when a new piece 
   *       is started at the top of the grid
   *   <li>deleting all cells to be collapsed
   *   <li>changing the status to GAME_OVER when a new piece collides with
   *       occupied positions in the top row
   * </ul>
   * @return the game status after the step
   */
  GameStatus step();
  
  /**
   * Performs a transform() operation on the current piece if it is 
   * possible to do so without letting it extend beyond the sides or 
   * bottom of the grid and without colliding with occupied cells in the grid.
   * 
   * @return true if the current piece was moved, false otherwise
   */
  boolean transform();
  
  /**
   * Performs a cycle() operation on the current piece. 
   */
  void cycle();
  
  /**
   * Shifts the current piece one cell to the left (decreasing the column), 
   * if it is possible to do so without letting it extend beyond the sides or 
   * bottom of the grid and without colliding with occupied cells in the grid.
   * 
   * @return true if the current piece was moved, false otherwise
   */ 
  boolean shiftLeft();
  
  /**
   * Shifts the current piece one cell to the right (increasing the column), 
   * if it is possible to do so without letting it extend beyond the sides or 
   * bottom of the grid and without colliding with occupied cells in the grid.
   * 
   * @return true if the current piece was moved, false otherwise
   */   
  boolean shiftRight();
  
  /**
   * Returns the icon associated with the given row and column, or null if
   * the location is unoccupied. 
   * @param row 
   *   the row of the cell
   * @param col 
   *   the column of the cell
   * @return the icon associated with the given row/column in the grid 
   */
  Icon getIcon(int row, int col);
  
  /**
   * Returns the current piece.
   * @return 
   *   the current piece.
   * @throws IllegalStateException if the game status is COLLAPSING or GAME_OVER
   */
  Piece getCurrent();
  
  /**
   * Returns the next piece to be dropped.
   * @return 
   *   the next piece.
   */
  Piece getPreview();
  
  /**
   * Returns the width of the grid.
   * @return 
   *   the width of the grid.
   */
  int getWidth();  
  
  /**
   * Returns the height of the grid.
   * @return 
   *   the height of the grid.
   */
  int getHeight();
  
  /**
   * Returns the grid positions to be collapsed.  This method can only be
   * called when the game state is COLLAPSING. The returned list is has 
   * no duplicates and is ordered according to the <code>compareTo</code>
   * method of the <code>Position</code> class. (The purpose of this method is
   * to allow clients to apply special rendering or animation to the 
   * collapsing positions.)
   * @return 
   *   list of Position objects representing the the grid positions to be 
   *   collapsed
   * @throws IllegalStateException if the game status is not COLLAPSING
   */
  List<Position> getPositionsToCollapse();
  
  
  /**
   * Returns the current score for this game.
   * @return 
   *   the current score for this game
   */
  int getScore();
  
  /**
   * Determines whether the game is over, which occurs when a new
   * piece in its initial position collides with occupied cells
   * of the grid.
   * @return 
   *   true if the game is over, false otherwise
   */
  boolean gameOver();
}
