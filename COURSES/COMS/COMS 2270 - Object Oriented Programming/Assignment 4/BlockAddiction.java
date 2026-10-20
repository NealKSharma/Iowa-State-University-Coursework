package hw4;

import api.AbstractGame;
import api.Generator;
import api.Position;
import api.Icon;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class BlockAddiction extends AbstractGame {

    public BlockAddiction(int height, int width,
			  Generator gen, int preFillRows) {
	super(height, width, gen);
	for (int i = 0; i < preFillRows; ++i) {
	    for (int j = 0; j < width; ++j) {
		if ((i + j) % 2 == 0) {
		    setBlock(height-1-i, j, gen.randomIcon());
		}
	    }
	}
    }

    public BlockAddiction(int height, int width, Generator gen) {
	super(height, width, gen);
    }

    @Override
    public List<Position> determinePositionsToCollapse() {
	ArrayList<Position> positions = new ArrayList<>();
	for (int row = 0; row < getHeight(); ++row) {
	    for (int col = 0; col < getWidth(); ++col) {
		Icon thisIcon = getIcon(row, col);
		if (thisIcon == null) {
		    continue;
		}
		int numNeighbors = 0;
		ArrayList<Position> matchers = new ArrayList<>();
		for (int p = -1; p < 2; ++p) {
		    for (int q = -1; q < 2; ++q) {
			if (p == 0 && q != 0 || q == 0 && p != 0) {
			    int nrow = row+p;
			    int ncol = col+q;
			    if (nrow >= 0 && nrow < getHeight() &&
				ncol >= 0 && ncol < getWidth()) {
				Icon otherIcon = getIcon(nrow, ncol);
				if (thisIcon.matches(otherIcon)) {
				    numNeighbors++;
				    matchers.add(new Position(nrow, ncol));
				}
			    }
			}
		    }
		}
		if (numNeighbors >= 2) {
		    Position newPos = new Position(row, col);
		    if (! positions.contains(newPos)) {
			positions.add(newPos);
		    }
		    for (Position neiPos : matchers) {
			if (! positions.contains(neiPos)) {
			    positions.add(neiPos);
			}
		    }
		}
	    }
	}
	// the algorithm above already guarantees there are no duplicates in
	// the list, but we have to sort them
	Collections.sort(positions);
	return positions;
    }
}
