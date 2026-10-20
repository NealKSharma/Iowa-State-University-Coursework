package ui;

import static api.Direction.DOWN;
import static api.Direction.LEFT;
import static api.Direction.RIGHT;
import static api.Direction.UP;
import static api.Orientation.VERTICAL;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.util.ArrayList;

import javax.swing.JPanel;

import api.Cell;
import api.Direction;
import hw3.Block;
import hw3.Board;

/**
 * Main panel for the user interface of a Block Slider game.
 * 
 * @author smkautz
 * @author tancreti
 */
public class BoardPanel extends JPanel {
	/**
	 * Suppress compiler warning.
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Score panel associated with the game.
	 */
	private ScorePanel scorePanel;

	/**
	 * The IGame instance for which this is the UI.
	 */
	private Board board;

	/**
	 * Constructs a BoardPanel with the given game associated ScorePanel.
	 * 
	 * @param board      the Game instance for which this is the UI
	 * @param scorePanel panel for displaying scores associated with the game
	 */
	public BoardPanel(Board board, ScorePanel scorePanel) {
		this.board = board;
		this.scorePanel = scorePanel;
		addMouseListener(new MyMouseListener());
		addMouseMotionListener(new MyMouseMotionListener());
	}

	/**
	 * Start over with a new game.
	 */
	public void reset() {
		board.reset();
		scorePanel.reset();
		repaint();
	}

	/**
	 * Reset the game with a given board.
	 * 
	 * @param board the given board
	 */
	public void reset(Board board) {
		this.board = board;
		reset();
	}

	// The paintComponent method is invoked by the Swing framework whenever
	// the panel needs to be rendered on the screen. In this application,
	// repainting is normally triggered by the calls to the repaint()
	// method in the timer callback and the mouse handlers

	@Override
	public void paintComponent(Graphics g) {
		// clear background
		g.setColor(GameMain.BACKGROUND_COLOR);
		g.fillRect(0, 0, getWidth(), getHeight());

		// paint the walls, apples, mushrooms and the exit
		for (int row = 0; row < board.getRowSize(); ++row) {
			for (int col = 0; col < board.getColSize(); ++col) {
				int x = GameMain.SIZE * col;
				int y = GameMain.SIZE * row;
				Cell cell = board.getCell(row, col);
				if (cell.isWall()) {
					g.setColor(GameMain.WALL_COLOR);
					g.fillRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
				} else if (cell.isExit()) {
					g.setColor(GameMain.EXIT_COLOR);
					g.fillRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
				}
			}
		}

		// draw all the cell outlines
		g.setColor(GameMain.GRID_COLOR);
		for (int row = 0; row < board.getRowSize(); ++row) {
			for (int col = 0; col < board.getColSize(); ++col) {
				int x = GameMain.SIZE * col;
				int y = GameMain.SIZE * row;
				g.drawRect(x, y, GameMain.SIZE - 1, GameMain.SIZE - 1);
			}
		}

		// draw the blocks
		ArrayList<Block> blocks = board.getBlocks();
		for (Block b : blocks) {
			// draw a line to connect all the segments
			Color color = GameMain.BLOCK_COLOR;
			int startRow = b.getFirstRow();
			int startCol = b.getFirstCol();
			int cellLength = b.getLength();
			if (b.getOrientation() == VERTICAL) {
				makeLine(g, startRow, startCol, startRow + cellLength - 1, startCol, color);
			} else {
				makeLine(g, startRow, startCol, startRow, startCol + cellLength - 1, color);
			}
		}
	}

	/**
	 * Draws line from center of first cell to center of second
	 */
	private void makeLine(Graphics g, int row1, int col1, int row2, int col2, Color color) {
		int s = GameMain.SIZE;
		int x1 = col1 * s + s / 2;
		int y1 = row1 * s + s / 2;
		int x2 = col2 * s + s / 2;
		int y2 = row2 * s + s / 2;
		g.setColor(color);
		((Graphics2D) g).setStroke(new BasicStroke(GameMain.LINE_SIZE));
		g.drawLine(x1, y1, x2, y2);
	}

	/**
	 * Gets the board.
	 * 
	 * @return the board
	 */
	public Board getBoard() {
		return board;
	}

	/**
	 * Callback for mouse events.
	 */
	private class MyMouseListener implements MouseListener {

		@Override
		public void mouseClicked(MouseEvent event) {
		}

		@Override
		public void mousePressed(MouseEvent event) {
			if (!board.isGameOver()) {
				int row = event.getY() / GameMain.SIZE;
				int col = event.getX() / GameMain.SIZE;
				board.grabBlockAtCell(row, col);
			}
			repaint();
		}

		@Override
		public void mouseReleased(MouseEvent event) {
			board.releaseBlock();
			scorePanel.updateScore(board.getMoveCount());
			if (board.isGameOver()) {
				scorePanel.gameOver();
			}
			repaint();
		}

		@Override
		public void mouseEntered(MouseEvent e) {
		}

		@Override
		public void mouseExited(MouseEvent e) {
		}
	}

	/**
	 * Callback for mouse motion events.
	 */
	private class MyMouseMotionListener implements MouseMotionListener {

		@Override
		public void mouseDragged(MouseEvent e) {
			if (!board.isGameOver()) {
				int row = e.getY() / GameMain.SIZE;
				int col = e.getX() / GameMain.SIZE;

				Cell cell = board.getGrabbedCell();
				int curRow = cell.getRow();
				int curCol = cell.getCol();

				Direction dir = null;
				if (col == curCol) {
					if (row == curRow + 1) {
						dir = DOWN;
					} else if (row == curRow - 1) {
						dir = UP;
					}
				} else if (row == curRow) {
					if (col == curCol + 1) {
						dir = RIGHT;
					} else if (col == curCol - 1) {
						dir = LEFT;
					}
				}
				if (dir != null) {
					board.moveGrabbedBlock(dir);
				}
			}

			scorePanel.updateScore(board.getMoveCount());
			if (board.isGameOver()) {
				scorePanel.gameOver();
			}
			repaint();
		}

		@Override
		public void mouseMoved(MouseEvent e) {
		}
	}
}
