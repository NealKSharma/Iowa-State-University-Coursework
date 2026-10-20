package hw3;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import api.Move;

/**
 * A puzzle solver for the the Block Slider game.
 * <p>
 * THE ONLY METHOD YOU ARE CHANGING IN THIS CLASS IS solve().
 * 
 * @author Neal Kaushik Sharma
 */
public class Solver {
	/**
	 * Maximum number of moves allowed in the search.
	 */
	private int maxMoves;

	/**
	 * Associates a string representation of a grid with the move count required to
	 * reach that grid layout.
	 */
	private Map<String, Integer> seen = new HashMap<String, Integer>();

	/**
	 * All solutions found in this search.
	 */
	private ArrayList<ArrayList<Move>> solutions = new ArrayList<ArrayList<Move>>();

	/**
	 * Constructs a solver with the given maximum number of moves.
	 * 
	 * @param givenMaxMoves maximum number of moves
	 */
	public Solver(int givenMaxMoves) {
		maxMoves = givenMaxMoves;
		solutions = new ArrayList<ArrayList<Move>>();
	}

	/**
	 * Returns all solutions found in the search. Each solution is a list of moves.
	 * 
	 * @return list of all solutions
	 */
	public ArrayList<ArrayList<Move>> getSolutions() {
		return solutions;
	}

	/**
	 * Prints all solutions found in the search.
	 */
	public void printSolutions() {
		for (ArrayList<Move> moves : solutions) {
			System.out.println("Solution:");
			for (Move move : moves) {
				System.out.println(move);
			}
			System.out.println();
		}
	}

	/**
	 * EXTRA CREDIT 15 POINTS
	 * <p>
	 * Recursively search for solutions to the given board instance according to the
	 * algorithm described in the assignment pdf. This method does not return
	 * anything its purpose is to update the instance variable solutions with every
	 * solution found.
	 * 
	 * @param board any instance of Board
	 */
	public void solve(Board board) {
		recursion(board, new ArrayList<>(), 0);
	}
	/**
	 * A private method to use recursion for the solve method
	 *
	 * @param board        The current state of the board
	 * @param moveSequence The sequence of moves taken place
	 * @param moves        Number of moves which keep getting incremented with each recursion
	 */
	private void recursion(Board board, ArrayList<Move> moveSequence, int moves) {
		
		// Stops if moves is greater than the limit of max moves.
		if (moves > maxMoves) return;
		
		if(board.isGameOver()) {
			solutions.add(new ArrayList<>(moveSequence));
			return;
		}
		
		String currentBoard = board.toString();
		
		// Skips if a state was found with fewer or equal moves.
		if(seen.containsKey(currentBoard) && seen.get(currentBoard) <= moves) return;
		
		seen.put(currentBoard, moves);
		
		for (Move move : board.getAllPossibleMoves()) {
			
	        Block block = move.getBlock();
			
	        board.grabBlockAtCell(block.getFirstRow(), block.getFirstCol());
	        board.moveGrabbedBlock(move.getDirection());
			
			moveSequence.add(move); // Adds move to sequence
			recursion(board, moveSequence, moves+1); // Recursion with the updated board and incremented moves. Also passes the moveSequence.
			
			board.undoMove();
			
			if (!moveSequence.isEmpty()) {
				moveSequence.remove(moveSequence.size() - 1); // Removes the last move
			}
		}
	}
}
