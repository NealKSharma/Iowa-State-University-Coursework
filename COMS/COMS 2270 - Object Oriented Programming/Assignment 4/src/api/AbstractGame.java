package api;

import java.util.List;

/**
 * A partial implementation of the Game interface for Tetris-like falling shape games. Subclasses must implement the method determinePositionsToCollapse().
 */
public abstract class AbstractGame implements Game
{
	/**
	 * Width of the game grid.
	 */
	private final int width;

	/**
	 * Height of the game grid.
	 */
	private final int height;

	/**
	 * The piece that is subject to motion during the step() method or via invocations of the shiftXXX(), transform(), or cycle() methods.
	 */
	private Piece current;

	/**
	 * The next Piece to be dropped.
	 */
	private Piece nextPiece;

	/**
	 * A grid whose positions may be occupied by the icons the current falling piece or icons that can no longer be moved. Unoccupied array cells are null.
	 */
	private Icon[][] grid;

	/**
	 * Status of the game after each invocation of step(), as described in the GameStatus documentation.
	 */
	private GameStatus gameStatus;

	/**
	 * Generator for new pieces. See the documentation for BasicGenerator as an example.
	 */
	private Generator generator;

	/**
	 * State variable indicating which icons are to be deleted when the status is COLLAPSING. The implementation maintains the invariant that positionsToCollapse.size() is nonzero if and only if
	 * gameStatus is COLLAPSING.
	 */
	private List<Position> positionsToCollapse;

	/**
	 * Default score is just the total number of icons collapsed.
	 */
	private int score;
	private int collapsedIconCounter;

	/**
	 * Constructs a new AbstracticonGame.
	 */
	protected AbstractGame(int givenHeight, int givenWidth, Generator generator)
	{
		width = givenWidth;
		height = givenHeight;
		grid = new Icon[getHeight()][getWidth()];
		this.generator = generator;
		current = generator.getNext(getWidth());
		nextPiece = generator.getNext(getWidth());
		gameStatus = GameStatus.NEW_SHAPE;
		score = 0;

	}

	/**
	 * Returns a list of locations for all cells that form part of a collapsible set. This list may contain duplicates.
	 * 
	 * @return list of locations for positions to be collapsed
	 */
	protected abstract List<Position> determinePositionsToCollapse();

	@Override
	public Icon getIcon(int row, int col)
	{
		return grid[row][col];
	}

	/**
	 * Sets a icon at the given row and column.
	 * 
	 * @param row given row
	 * @param col given column
	 * @param value given Icon value
	 */
	public void setBlock(int row, int col, Icon value)
	{
		grid[row][col] = value;
	}

	@Override
	public int getHeight()
	{
		return height;
	}

	@Override
	public Piece getCurrent()
	{
		if (gameStatus == GameStatus.COLLAPSING || gameStatus == GameStatus.GAME_OVER)
		{
			throw new IllegalStateException();
		}
		return current;
	}

	@Override
	public Piece getPreview()
	{
		return nextPiece;
	}

	@Override
	public int getWidth()
	{
		return width;
	}

	@Override
	public int getScore()
	{
		return score;
	}

	@Override
	public List<Position> getPositionsToCollapse()
	{
		if (positionsToCollapse.size() == 0)
		{
			throw new IllegalStateException();
		}
		return positionsToCollapse;
	}

	@Override
	public boolean transform()
	{
		boolean ret = canTransform();
		if (ret)
		{
			current.transform();
		}
		return ret;
	}

	@Override
	public void cycle()
	{
		current.cycle();
	}

	@Override
	public boolean shiftLeft()
	{
		boolean ret = canShiftLeft();
		if (ret)
		{
			current.shiftLeft();
		}
		return ret;
	}

	@Override
	public boolean shiftRight()
	{
		boolean ret = canShiftRight();
		if (ret)
		{
			current.shiftRight();
		}
		return ret;
	}

	@Override
	public boolean gameOver()
	{
		return gameStatus == GameStatus.GAME_OVER;
	}

	//
	// Main game logic - see Game interface documentation
	//
	@Override
	public GameStatus step()
	{
		switch (gameStatus)
		{
			case GAME_OVER:
				// do nothing
				break;
			case NEW_SHAPE:
			case FALLING:
				if (gameStatus == GameStatus.NEW_SHAPE)
				{
					gameStatus = GameStatus.FALLING;
				}
				if (canShiftDown())
				{
					current.shiftDown();
				}
				else
				{
					// Add icons of the current piece to the grid, maybe
					// temporarily, in order to check whether it has completed
					// a collapsible group
					for (Cell c : current.getCellsAbsolute())
					{
						int x = c.getCol();
						int y = c.getRow();
						if (y >= 0 && y < height && x >= 0 && x < width)
						{
							grid[y][x] = c.getIcon();
						}
					}
					positionsToCollapse = determinePositionsToCollapse();
					if (positionsToCollapse.size() != 0)
					{
						// current piece completes a collapsible set,
						// so prepare to collapse
						gameStatus = GameStatus.COLLAPSING;
					}
					else
					{
						// current piece is stopped, but has not completed a
						// collapsible set, so it might be moved sideways;
						// take its icons back out of the grid
						for (Cell c : current.getCellsAbsolute())
						{
							int x = c.getCol();
							int y = c.getRow();
							if (y >= 0 && y < height && x >= 0 && x < width)
							{
								grid[y][x] = null;
							}
						}
						gameStatus = GameStatus.STOPPED;
					}
				}
				break;
			case STOPPED:
				// If the piece was previously stopped, it still may be possible
				// to shift it downwards since it could have been moved to the side
				// during the last step
				if (canShiftDown())
				{
					current.shiftDown();
					gameStatus = GameStatus.FALLING;
				}
				else
				{
					// we only get in the stopped state when the piece doesn't complete
					// a collapsible set; add icons to grid and start a new piece at the top
					for (Cell c : current.getCellsAbsolute())
					{
						int x = c.getCol();
						int y = c.getRow();
						if (y >= 0 && y < height && x >= 0 && x < width)
						{
							grid[y][x] = c.getIcon();
						}
					}
					current = nextPiece;
					nextPiece = generator.getNext(getWidth());
					if (collides(current))
					{
						gameStatus = GameStatus.GAME_OVER;
					}
					else
					{
						gameStatus = GameStatus.NEW_SHAPE;
					}
				}
				break;
			case COLLAPSING:
				collapsePositions(positionsToCollapse);
				positionsToCollapse = determinePositionsToCollapse();
				if (positionsToCollapse.size() == 0)
				{
					// done collapsing, try to start a new shape
					current = nextPiece;
					nextPiece = generator.getNext(getWidth());
					if (collides(current))
					{
						gameStatus = GameStatus.GAME_OVER;
					}
					else
					{
						gameStatus = GameStatus.NEW_SHAPE;
					}

					// we now have the total number of icons collapsed while in the
					// collapsing state, so add them to the score
					score += collapsedIconCounter * collapsedIconCounter;
					collapsedIconCounter = 0;
				}
				// else, we'll do some more collapsing during the next call to step()
				break;
		}
		return gameStatus;
	}

	/**
	 * Deletes the icons at the indicated positions and shifts icons above them down. Only icons lying within a column above a deleted icon are shifted down. This method does not update the game state
	 * and should normally be called only from the step() method.
	 * 
	 * @param positionsToCollapse list of positions to collapse, may contain duplicates.
	 * @return number of icons actually collapsed
	 */
	public int collapsePositions(List<Position> positionsToCollapse)
	{
		int count = 0;
		for (int col = 0; col < getWidth(); ++col)
		{
			int temp = collapseOneColumn(positionsToCollapse, col);
			count += temp;
		}
		collapsedIconCounter += count;
		return count;
	}

	/**
	 * Collapses one column using the given positions.
	 * 
	 * @param positionsToCollapse
	 * @param col
	 */
	private int collapseOneColumn(List<Position> positionsToCollapse, int col)
	{
		// flag the positions in this column that need to be collapsed
		boolean[] marked = new boolean[getHeight()];
		int count = 0;
		for (Position p : positionsToCollapse)
		{
			if (p.col() == col)
			{
				marked[p.row()] = true;
				count += 1;
			}
		}
		int index = getHeight() - 1;
		for (int row = getHeight() - 1; row >= 0; --row)
		{
			if (!marked[row])
			{
				grid[index][col] = grid[row][col];
				index -= 1;
			}
		}
		for (int row = index; row >= 0; --row)
		{
			grid[row][col] = null;
		}
		return count;
	}

	/**
	 * Determines whether the current shape can be shifted down. Does not modify the game state.
	 * 
	 * @return true if the current shape can be shifted down, false otherwise
	 */
	private boolean canShiftDown()
	{
		Piece t = (Piece) current.clone();
		t.shiftDown();
		return !collides(t);
	}

	/**
	 * Determines whether the current shape can be shifted right. Does not modify the game state.
	 * 
	 * @return true if the current shape can be shifted right, false otherwise
	 */
	private boolean canShiftRight()
	{
		Piece t = (Piece) current.clone();
		t.shiftRight();
		return !collides(t);
	}

	/**
	 * Determines whether the current shape can be shifted left. Does not modify the game state.
	 * 
	 * @return true if the current shape can be shifted left, false otherwise
	 */
	private boolean canShiftLeft()
	{
		Piece t = (Piece) current.clone();
		t.shiftLeft();
		return !collides(t);
	}

	/**
	 * Determines whether the current shape can be transform. Does not modify the game state.
	 * 
	 * @return true if the current shape can be transformed, false otherwise
	 */
	private boolean canTransform()
	{
		Piece t = (Piece) current.clone();
		t.transform();
		return !collides(t);
	}

	/**
	 * Determines whether the given shape overlaps with the occupied cells of the grid, or extends beyond the sides or bottom of the grid. (A shape in its initial position MAY extend above the grid.)
	 *
	 * @param t a shape
	 * @return true if the cells of the given shape extend beyond the sides or bottom of the grid or overlap with any occupied cells of the grid
	 */
	private boolean collides(Piece t)
	{
		for (Cell c : t.getCellsAbsolute())
		{
			int x = c.getCol();
			int y = c.getRow();
			if (x < 0 || x > width - 1 || y > height - 1)
			{
				return true;
			}

			// row, column
			if (y >= 0 && grid[y][x] != null)
			{
				return true;
			}
		}
		return false;
	}

	// an alternate implementation of the collapse algorithm?
	private void collapseOneColumnAlt(List<Position> positionsToCollapse, int col)
	{
		// flag the positions in this column that need to be collapsed
		boolean[] marked = new boolean[getHeight()];
		for (Position p : positionsToCollapse)
		{
			if (p.col() == col)
			{
				marked[p.row()] = true;
			}
		}

		// count the number of marked positions below each row. This
		// is how far we have to move each unmarked icon. Note we don't
		// care if it's null or not
		int count = 0;
		int[] counts = new int[getHeight()];

		for (int row = getHeight() - 1; row >= 0; --row)
		{
			if (marked[row])
			{
				count += 1;
			}
			else
			{
				counts[row] = count;
			}
		}

		// now shift down by the amount we counted, starting at the bottom
		int lastMoved = getHeight() - 1;
		for (int row = getHeight() - 1; row >= 0; --row)
		{
			if (counts[row] > 0)
			{
				// indicates something that needs to be moved
				int newIndex = row + counts[row];
				grid[newIndex][col] = grid[row][col];
				lastMoved = newIndex;
			}
		}

		// everything above the last cell we moved should be null
		for (int row = 0; row < lastMoved; ++row)
		{
			grid[row][col] = null;
		}
	}
}