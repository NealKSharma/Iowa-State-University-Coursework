package api;

/**
 * Interface for pieces used by Tetris-like games. Each piece has a position, a size, and a set of Cells. The position is the upper-left corner of the piece's bounding box, which has a fixed size. The
 * initial position of the bounding box and the relative positions of the cells are assigned in a constructor, and thereafter the position can be modified by the shiftXXX() methods. The constructor
 * also establishes a relative ordering of the cells. The getCells() and getCellsAbsolute methods always return the cells in this ordering, and the cycle() method always uses this ordering for
 * shifting the icons. No bounds checking is ever done in implementations of this interface; therefore, the piece position and the cell positions can have negative coordinates.
 */
public interface Piece extends Cloneable
{
	/**
	 * Returns the position of this piece (upper-left corner of its bounding box).
	 * 
	 * @return position of this shape
	 */
	Position getPosition();

	/**
	 * Returns a deep copy of the Cell objects in this piece. The cell positions are relative to the upper-left corner of its bounding box.
	 * 
	 * @return copy of the cells in this piece
	 */
	Cell[] getCells();

	/**
	 * Returns a new array of Cell objects representing the icons in this piece with their absolute positions (relative positions plus position of bounding box).
	 * 
	 * @return copy of the cells in this piece, with absolute positions
	 */
	Cell[] getCellsAbsolute();

	/**
	 * Sets the cells in this piece, making a deep copy of the given array.
	 * 
	 * @param givenCells new cells for this piece
	 */
	void setCells(Cell[] givenCells);

	/**
	 * Shifts the position of this piece down (increasing the row) by one. No bounds checking is done.
	 */
	void shiftDown();

	/**
	 * Shifts the position of this piece left (decreasing the column) by one. No bounds checking is done.
	 */
	void shiftLeft();

	/**
	 * Shifts the position of this piece right (increasing the column) by one. No bounds checking is done.
	 */
	void shiftRight();

	/**
	 * Transforms this piece without altering its position according to the rules of the game to be implemented. Typical operations would be rotation or reflection. No bounds checking is done.
	 */
	void transform();

	/**
	 * Cycles the icons within the cells of this piece. Each icon is shifted forward to the next cell (in the original ordering of the cells). The last icon wraps around to the first cell.
	 */
	void cycle();

	/**
	 * Returns a deep copy of this object having the correct runtime type.
	 * 
	 * @return a deep copy of this object
	 */
	Piece clone();
}
