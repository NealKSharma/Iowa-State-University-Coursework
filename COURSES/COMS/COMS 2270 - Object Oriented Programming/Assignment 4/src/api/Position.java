package api;

/**
 * Data container for a row and column. This class is immutable.
 */
public class Position implements Comparable<Position>
{
	/**
	 * The row.
	 */
	private final int row;

	/**
	 * The column.
	 */
	private final int col;

	/**
	 * Constructs a Position with the given row and column.
	 * 
	 * @param givenRow given row
	 * @param givenCol given column
	 */
	public Position(int givenRow, int givenCol)
	{
		row = givenRow;
		col = givenCol;
	}

	/**
	 * Returns the row for this position.
	 * 
	 * @return row for this position
	 */
	public int row()
	{
		return row;
	}

	/**
	 * Returns the column for this position.
	 * 
	 * @return column for this position
	 */
	public int col()
	{
		return col;
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == null || !(obj instanceof api.Position))
		{
			return false;
		}

		Position other = (Position) obj;
		return row == other.row && col == other.col;
	}

	@Override
	public String toString()
	{
		return "(" + row + ", " + col + ")";
	}

	@Override
	public int hashCode()
	{
		int result = 31 + row;
		result = 31 * result + row;
		return result;
	}

	@Override
	public int compareTo(Position other)
	{
		if (row == other.row)
		{
			return col - other.col;
		}
		return row - other.row;
	}
}
