package api;

/**
 * Enum representing internal state of a cell in the board grid. Clients
 * normally do not directly use this type, since it can't be accessed after the
 * cell is first constructed.
 * 
 * @author smkautz
 * @author tancreti
 */
public enum CellType {
	FLOOR, WALL, EXIT;
}
