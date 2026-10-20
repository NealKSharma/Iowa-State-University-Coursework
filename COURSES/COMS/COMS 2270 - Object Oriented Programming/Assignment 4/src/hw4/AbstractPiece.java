
package hw4;

import api.Cell;
import api.Icon;
import api.Position;
import api.Piece;

/**
 * Abstract superclass for implementations of the Piece interface.
 * 
 * This class provides the functionality for a piece, including position management,
 * cell handling, and cell shifting. It also serves as a parent class for the other piece specific classes.
 * 
 * @author Neal Kaushik Sharma
 */
public abstract class AbstractPiece implements Piece
{
  /**
   * Position of this Piece
   */
  private Position position;

  /**
   * Cells of this Piece
   */
  private Cell[] cells;
  
  /**
   * Constructs a piece with the given position.
   * Subclasses extending this class MUST call setCells to initialize initial cell positions and icons.
   * 
   * @param position the initial position for the upper-left corner of the bounding box
   */
  protected AbstractPiece(Position position)
  {
    this.position = position;
    this.cells = new Cell[4];
  }
  
  /**
   * Returns the current position of the current piece.
   * 
   * @return the position of the current piece
   */
  @Override
  public Position getPosition()
  {
	  return position;
  }
  
  /**
   * Sets the cells for this piece. This method copies the given array of cells.
   * 
   * @param givenCells the array of cells to assign to this piece
   */
  @Override
  public void setCells(Cell[] givenCells)
  {
	  cells = new Cell[givenCells.length];
      for (int i = 0; i < givenCells.length; i++) {
          cells[i] = new Cell(givenCells[i]);
      }
  }
  
  /**
   * Returns a copy of the cells for this piece.
   * 
   * @return a copy of the cells array
   */
  @Override
  public Cell[] getCells() {
      Cell[] copy = new Cell[cells.length];
      for (int i = 0; i < cells.length; i++) {
          copy[i] = new Cell(cells[i]);
      }
      return copy;
  }

  /**
   * Returns the absolute position of each cell in this piece, accounting for the piece's current position.
   * 
   * @return an array of cells with their absolute positions
   */
  @Override
  public Cell[] getCellsAbsolute() {
	  
      Cell[] ret = new Cell[cells.length];
      
      for (int i = 0; i < cells.length; i++) {
          int row = cells[i].getRow() + position.row();
          int col = cells[i].getCol() + position.col();
          Icon b = cells[i].getIcon();
          ret[i] = new Cell(b, new Position(row, col));
      }
      return ret;
  }
  
  /**
   * Shifts this piece down by one row.
   */
  @Override
  public void shiftDown() {
      position = new Position(position.row() + 1, position.col());
  }

  /**
   * Shifts this piece left by one column.
   */
  @Override
  public void shiftLeft() {
      position = new Position(position.row(), position.col() - 1);
  }

  /**
   * Shifts this piece right by one column.
   */
  @Override
  public void shiftRight() {
      position = new Position(position.row(), position.col() + 1);
  }

  /**
   * Transforms the piece. The specific transformation is implemented by subclasses. 
   */
  @Override
  public abstract void transform();

  /**
   * Cycles the icons of the cells in this piece. The icons shift one position to the right, and the last icon wraps around to the first position.
   */
  @Override
  public void cycle() {
      Icon lastIcon = cells[cells.length - 1].getIcon();
      for (int i = cells.length - 1; i > 0; i--) {
          cells[i].setIcon(cells[i - 1].getIcon());
      }
      cells[0].setIcon(lastIcon);
  }
    
  @Override
  public Piece clone()
  {
    try
    {
      AbstractPiece s = (AbstractPiece)super.clone();

      // make it into a deep copy (note there is no need to copy the position,
      // since Position is immutable)
      s.cells = new Cell[cells.length];
      for (int i = 0; i < cells.length; ++i)
      {
        s.cells[i] = new Cell(cells[i]);
      }
      return s;
    }
    catch (CloneNotSupportedException e)
    {
      // can't happen
      return null;
    }
  }
}
