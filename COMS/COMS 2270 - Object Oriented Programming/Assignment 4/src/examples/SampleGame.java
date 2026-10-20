package examples;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import api.AbstractGame;
import api.Position;

/**
 * Very simple subclass of AbstractGame for experimentation.
 * In this game, a "collapsible set" is formed by filling an entire row, as
 * in a traditional game of Tetris. (It does not matter if the icon colors match).
 */
public class SampleGame extends AbstractGame
{
  public SampleGame()
  {
    super(8, 10, new SampleGenerator());
  }


  @Override
  public List<Position> determinePositionsToCollapse()
  {
    List<Position> positions = new ArrayList<>();
    for (int row = 0; row < getHeight(); ++row)
    {
      if (isRowFilled(row))
      {
        // row forms a collapsible set, put all positions in the list
        for (int col = 0; col < getWidth(); ++col)
        {
          positions.add(new Position(row, col));
        }
      }
    }
    
    // the algorithm above already guarantees there are no duplicates in the
    // list, but we have to sort them
    Collections.sort(positions);
    return positions;
  }


  /**
   * Determines whether the given row is completely filled (i.e., all
   * icons are non-null).
   * @param row
   *   the row to be checked
   * @return
   *   true if all icons in the row are non-null, false otherwise
   */
  private boolean isRowFilled(int row)
  {
    for (int col = 0; col < getWidth(); ++col)
    {
      if (getIcon(row, col) == null)
      {
        return false;
      }
    }
    return true;
  }
}
