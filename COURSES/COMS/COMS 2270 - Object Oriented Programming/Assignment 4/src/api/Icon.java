package api;

import java.awt.Color;

/**
 * Interface specifying an icon or block in a Tetris-like game. This class just encapsulates a color and has some useful methods for checking whether one icon matches another and for creating string
 * representations. This class is immutable.
 */
public class Icon
{
	/**
	 * Possible colors for the icons.
	 */
	public static final Color[] COLORS = { Color.CYAN, Color.BLUE, Color.ORANGE, Color.YELLOW, Color.GREEN, Color.MAGENTA, Color.RED };

	/**
	 * Possible color abbreviations to use for text output.
	 */
	public static final String[] COLOR_NAMES = { "C", "B", "O", "Y", "G", "M", "R" };

	/**
	 * The color associated with this icon.
	 */
	private final Color color;

	/**
	 * Constructs an icon with the given color.
	 * 
	 * @param c color to be associated with this icon
	 */
	public Icon(Color c)
	{
		this.color = c;
	}

	/**
	 * Returns the color associated with this icon.
	 * 
	 * @return color for this icon
	 */
	public Color getColorHint()
	{
		return color;
	}

	/**
	 * Determines whether this icon has the same color as the given icon.
	 * 
	 * @param other given icon
	 * @return true if this icon matches the given icon
	 */
	public boolean matches(Icon other)
	{
		return (other != null && color.equals(other.getColorHint()));
	}

	@Override
	public String toString()
	{
		int index = -1;
		for (int i = 0; i < COLORS.length; ++i)
		{
			if (color.equals(COLORS[i]))
			{
				index = i;
				break;
			}
		}
		if (index >= 0)
		{
			return COLOR_NAMES[index];
		}
		else
		{
			return "?";
		}
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == null || obj.getClass() != this.getClass())
		{
			return false;
		}
		Icon other = (Icon) obj;
		return color.equals(other.color);
	}

}
