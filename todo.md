# Checklist of things to implement, fix, etc.

- [x] Make sure that in the preview component, we truncate the sequence's text with ... early instead of allowing for a horizontally scrolling overflow
- [x] In the preview plot, add a grey (n, a(n)) to follow where the user hovers.  Unlike the full plot, don't surround it with a bounding box.  This should be very subtle.
- [x] Under recently added, above each sequence preview component we have written another copy of the string Recently added.  Instead, it should say the date that sequence entry was added.  That can be found inside the "created" JSON field
- [x] Add a dark/light/system toggle button to the top right
- [x] On the sequence details page, there's a large section of Sequence Values, where there's a box around every single number.  That's a bad interface.  Instead, make a component for displaying a sequence's values.
    - It should look like a table with 2 rows.
    - The first column's top entry is a(n), and bottom entry n.
    - Accent color horizontal line separating the 2 rows, and vertical line separating the first column from the rest of the columns
    - Grey subtle vertical line separating the other columns
    - The top row's numbers are all in accent color, the bottom row's numbers are all grey
- [x] Make sure the hover tooltip on the plot preview never overlaps the plot line
- [x] Make the string for recently added time, e.g. "1 Months Ago" properly use plural or singular to be gramatically correct.  On hover, show the actual date.
- [x] Make sure that the headers for the 2 columns start with aligned y values before the user begins scrolling.  Currently the Random Sequence header is slightly lower than the Recently Added column
- [x] Make the Recently added column 10% narrower, and give that horizontal space to the Random Sequence column