import java.io.FileNotFoundException;
import java.util.ArrayList;
import api.DescriptionUtil;
import api.Move;
import hw3.Board;
import hw3.Solver;

public class SolverTests {
  public static void main(String args[]) throws FileNotFoundException {
    ArrayList<String[][]> gameDescriptions = DescriptionUtil
            .readBoardDescriptionsFromFile("simple-games.txt");
    int boardIndex = 0; // change to select different board setup
    Board board = new Board(gameDescriptions.get(boardIndex));

    Solver solver = new Solver(6); // set higher for larger puzzles
    solver.solve(board);
    ArrayList<ArrayList<Move>> solutions = solver.getSolutions();

    System.out.println("Number of solutions found: " + solutions.size());
    solver.printSolutions();
  }
}
