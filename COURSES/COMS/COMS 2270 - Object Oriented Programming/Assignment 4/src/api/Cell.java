package api;

/**
 * Container for an icon and a position.
 */
public class Cell
{
	/**
	 * The icon represented by this Cell.
	 */
	private Icon icon;

	/**
	 * The position of this Cell.
	 */
	private Position position;

	/**
	 * Constructs a Cell from the given icon and position.
	 * 
	 * @param b given Icon
	 * @param position given Position
	 */
	public Cell(Icon b, Position position)
	{
		// icons and positions are immutable, no need to copy them
		this.icon = b;
		this.position = position;
	}

	/**
	 * Copy constructor creates a copy of the given Cell.
	 * 
	 * @param existing the given Cell
	 */
	public Cell(Cell existing)
	{
		// icons and positions are immutable, no need to copy them
		this.icon = existing.icon;
		this.position = existing.position;
	}

	/**
	 * Returns the column for this cell's position.
	 * 
	 * @return the column for this cell
	 */
	public int getCol()
	{
		return position.col();
	}

	/**
	 * Returns the row for this cell's position.
	 * 
	 * @return the row for this cell
	 */
	public int getRow()
	{
		return position.row();
	}

	/**
	 * Updates this cell's position to have the given column.
	 * 
	 * @param col the new column
	 */
	public void setCol(int col)
	{
		position = new Position(position.row(), col);
	}

	/**
	 * Updates this cell's position to have the given row.
	 * 
	 * @param row the new row
	 */
	public void setRow(int row)
	{
		position = new Position(row, position.col());
	}

	/**
	 * Updates this cell's position to have the given row and column.
	 * 
	 * @param row the new row
	 * @param col the new column
	 */
	public void setRowCol(int row, int col)
	{
		position = new Position(row, col);
	}

	/**
	 * Sets this cell's position.
	 * 
	 * @param position given position
	 */
	public void setPosition(Position position)
	{
		this.position = position;
	}

	/**
	 * Returns the icon associated with this Cell.
	 * 
	 * @return the icon associated with this Cell
	 */
	public Icon getIcon()
	{
		return icon;
	}

	/**
	 * Sets the icon associated with this Cell.
	 * 
	 * @param b the new icon
	 */
	public void setIcon(Icon b)
	{
		icon = b;
	}

	@Override
	public String toString()
	{
		String b = icon == null ? "null" : icon.toString();
		String p = position == null ? "(null position)" : position.toString();
		return b + p;
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == null || obj.getClass() != this.getClass())
		{
			return false;
		}
		Cell other = (Cell) obj;
		boolean iconsEqual = icon == null && other.icon == null || icon.equals(other.icon);
		boolean positionsEqual = position == null && other.position == null || position.equals(other.position);
		return iconsEqual && positionsEqual;
	}
}
