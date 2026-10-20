import static api.CellType.*;
import static api.Orientation.*;
import static api.Direction.*;

import java.util.ArrayList;
import java.util.Arrays;

import api.Cell;
import api.Move;
import hw3.Block;
import hw3.Board;
import hw3.GridUtil;

public class SimpleTests {
	public static final String[][] testDescription1 =
		{ { "*", "*", "*", "*", "*" },
		  { "*", ".", ".", ".", "*" },
		  { "*", "[", "]", ".", "e" },
		  { "*", ".", ".", ".", "*" },
		  { "*", "*", "*", "*", "*" } };

	private static final Cell[][] testGrid1 = {
			{ new Cell(WALL, 0, 0), new Cell(WALL, 0, 1), new Cell(WALL, 0, 2), new Cell(WALL, 0, 3), new Cell(WALL, 0, 4) },
			{ new Cell(WALL, 1, 0), new Cell(FLOOR, 1, 1), new Cell(FLOOR, 1, 2), new Cell(FLOOR, 1, 3), new Cell(WALL, 1, 4) },
			{ new Cell(WALL, 2, 0), new Cell(FLOOR, 2, 1), new Cell(FLOOR, 2, 2), new Cell(FLOOR, 2, 3), new Cell(EXIT, 2, 4) },
			{ new Cell(WALL, 3, 0), new Cell(FLOOR, 3, 1), new Cell(FLOOR, 3, 2), new Cell(FLOOR, 3, 3), new Cell(WALL, 3, 4) },
			{ new Cell(WALL, 4, 0), new Cell(WALL, 4, 1), new Cell(WALL, 4, 2), new Cell(WALL, 4, 3), new Cell(WALL, 4, 4) } };

	private static ArrayList<Block> makeTest1Blocks() {
		ArrayList<Block> blocks = new ArrayList<Block>();
		blocks.add(new Block(2, 1, 2, HORIZONTAL));
		return blocks;
	}

	public static void main(String args[]) {
		Block block = new Block(2, 1, 2, HORIZONTAL);
		System.out.println("Block is " + block);
		block.move(DOWN);
		System.out.println("After move DOWN, block is " + block);
		System.out.println("Expected block at (row=2, col=1).");
		block.move(RIGHT);
		System.out.println("After move RIGHT, block is " + block);
		System.out.println("Expected block at (row=2, col=2).");
		System.out.println();

		Cell[][] cells = GridUtil.createGrid(testDescription1);
		System.out.println("Using testDescription1, cell (2, 4) is an exit is "
					+ cells[2][4].isExit() + ", expected is true.");
		
		ArrayList<Block> blocks = GridUtil.findBlocks(testDescription1);
		System.out.println("Using testDescription1, number of blocks is "
					+ blocks.size() + ", expected is 1.");
		System.out.println("Using testDescription1, first block is length "
					+ blocks.get(0).getLength() + ", expected is 2.");
		System.out.println();


		System.out.println("Making board with testGrid1.");
		Board board = new Board(testGrid1, makeTest1Blocks());
		System.out.println(board.toString());
		System.out.println();
		
		board.grabBlockAtCell(2, 1);
		System.out.println("Grabbed block " + board.getGrabbedBlock());
		System.out.println("Location of grab is at (" + board.getGrabbedCell().getRow()
					+ ", " + board.getGrabbedCell().getCol() + ") " + ", expected (2, 1).");
		System.out.println();
		
		board.moveGrabbedBlock(RIGHT);
		System.out.println("After moving block right one time game over is " + board.isGameOver()
				+ ", expected is false.");
		System.out.println(board.toString());
		System.out.println();

		board.moveGrabbedBlock(RIGHT);
		System.out.println("After moving block right two times game over is " + board.isGameOver()
				+ ", expected is true.");
		System.out.println(board.toString());
		System.out.println();
		
		board.reset();
		System.out.println("After reset:");
		System.out.println(board.toString());
		System.out.println();

		ArrayList<Move> moves = board.getAllPossibleMoves();
		System.out.println("All possible moves: " + Arrays.toString(moves.toArray()));
	}
}
