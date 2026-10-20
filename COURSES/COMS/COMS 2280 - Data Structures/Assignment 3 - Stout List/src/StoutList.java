package edu.iastate.cs2280.hw3;

import java.util.AbstractSequentialList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.NoSuchElementException;

/**
 * Implementation of the list interface based on linked nodes
 * that store multiple items per node. Rules for adding and removing
 * elements ensure that each node (except possibly the last one)
 * is at least half full.
 */
public class StoutList<E extends Comparable<? super E>> extends AbstractSequentialList<E> {
    /**
     * Default number of elements that may be stored in each node.
     */
    private static final int DEFAULT_NODESIZE = 4;

    /**
     * Number of elements that can be stored in each node.
     */
    private final int nodeSize;

    /**
     * Dummy node for head. It should be private but set to public here only
     * for grading purpose. In practice, you should always make the head of a
     * linked list a private instance variable.
     */
    public Node head;

    /**
     * Dummy node for tail.
     */
    private Node tail;

    /**
     * Number of elements in the list.
     */
    private int size;

    /**
     * Constructs an empty list with the default node size.
     */
    public StoutList() {
        this(DEFAULT_NODESIZE);
    }

    /**
     * Constructs an empty list with the given node size.
     * @param nodeSize number of elements that may be stored in each node, must be
     *   an even number
     */
    public StoutList(int nodeSize) {
        if (nodeSize <= 0 || nodeSize % 2 != 0) throw new IllegalArgumentException();

        // dummy nodes
        head = new Node();
        tail = new Node();
        head.next = tail;
        tail.previous = head;
        this.nodeSize = nodeSize;
    }

    /**
     * Constructor for grading only. Fully implemented.
     * @param head
     * @param tail
     * @param nodeSize
     * @param size
     */
    public StoutList(Node head, Node tail, int nodeSize, int size) {
        this.head = head;
        this.tail = tail;
        this.nodeSize = nodeSize;
        this.size = size;
    }
    
    /**
	 * @return the number of elements in the list
	 */
    @Override
    public int size() {
        return size;
    }
    
    /**
	 * Adds the item to the end of the list
	 * 
	 * @param item the item to add to the list
	 * @return true if item was added successfully
	 * 		   false if item already exists in the list
	 */
    @Override
    public boolean add(E item) {
        if (item == null) throw new NullPointerException();
        if (contains(item)) return false;

        // Empty list case
        if (size == 0) {
            Node newNode = new Node();
            newNode.addItem(item);
            head.next = newNode;
            newNode.previous = head;
            newNode.next = tail;
            tail.previous = newNode;
        } 
        // Add to last node if it has space
        else if (tail.previous.count < nodeSize) {
            tail.previous.addItem(item);
        } 
        // Create new node if last node is full
        else {
            Node newNode = new Node();
            newNode.addItem(item);
            Node last = tail.previous;
            last.next = newNode;
            newNode.previous = last;
            newNode.next = tail;
            tail.previous = newNode;
        }
        // Increases the size of the list
        size++;
        return true;
    }

    /**
	 * Adds item to a specific index
	 *
	 * @param pos the position where the item should go to
	 * @param item the item to add to the list
	 */
    @Override
    public void add(int pos, E item) {
        if (item == null) throw new NullPointerException();
        if (pos < 0 || pos > size) throw new IndexOutOfBoundsException();

        // Adding at the end is same as regular add
        if (pos == size) {
            add(item);
            return;
        }

        NodeInfo nodeInfo = find(pos);
        Node node = nodeInfo.node;
        int offset = nodeInfo.offset;

        // Case 1: Adding at start of node with space in previous node
        if (offset == 0 && node.previous != head && node.previous.count < nodeSize) {
            node.previous.addItem(item);
        } 
        
        // Case 2: Current node has space
        else if (node.count < nodeSize) {
            node.addItem(offset, item);
        } 
        
        // Case 3: Need to split node
        else {
            Node newNode = new Node();
            int half = nodeSize / 2;
            
            // Move last half elements to new node
            for (int i = half; i < nodeSize; i++) {
                newNode.addItem(node.data[i]);
                node.data[i] = null;
            }
            node.count = half;

            // Insert new node after current node
            newNode.next = node.next;
            newNode.previous = node;
            node.next.previous = newNode;
            node.next = newNode;

            // Decide where to put new item
            if (offset <= half) {
                node.addItem(offset, item);
            } else {
                newNode.addItem(offset - half, item);
            }
        }
        size++;
    }

    /**
	 * Removes an item that is in a specific index
	 * 
	 * @param pos the position where the item should be removed
	 * @return item that was removed
	 */
	@Override
    public E remove(int pos) {
        if (pos < 0 || pos >= size) throw new IndexOutOfBoundsException();

        NodeInfo nodeInfo = find(pos);
        Node node = nodeInfo.node;
        int offset = nodeInfo.offset;
        E removedItem = node.data[offset];

        // Case 1: Last node with only one element
        if (node.next == tail && node.count == 1) {
            node.previous.next = tail;
            tail.previous = node.previous;
            // Clear references to help GC
            node.previous = null;
            node.next = null;
            node.data = null;
        }
        // Case 2: Last node with multiple elements or node has more than M/2 elements
        else if (node.next == tail || node.count > nodeSize / 2) {
            node.removeItem(offset);
        }
        // Case 3: Node has <= M/2 elements, check successor
        else {
            node.removeItem(offset);
            Node successor = node.next;

            // Mini-merge: successor has > M/2 elements
            if (successor.count > nodeSize / 2) {
                node.addItem(successor.data[0]);
                successor.removeItem(0);
            }
            // Full merge: successor has <= M/2 elements
            else {
                for (int i = 0; i < successor.count; i++) {
                    node.addItem(successor.data[i]);
                }
                node.next = successor.next;
                successor.next.previous = node;
                // Clear references to help GC
                successor.previous = null;
                successor.next = null;
                successor.data = null;
            }
        }

        size--;
        return removedItem;
    }
    
    /**
     * Sort all elements in the stout list in the NON-DECREASING order. You may do the following. 
     * Traverse the list and copy its elements into an array, deleting every visited node along 
     * the way.  Then, sort the array by calling the insertionSort() method.  (Note that sorting 
     * efficiency is not a concern for this project.)  Finally, copy all elements from the array 
     * back to the stout list, creating new nodes for storage. After sorting, all nodes but 
     * (possibly) the last one must be full of elements.  
     *  
     * Comparator<E> must have been implemented for calling insertionSort().    
     */
    public void sort() {
        if (size <= 1) return;

        // Copy elements to array
        E[] arr = (E[]) new Comparable[size];
        
        int index = 0;
        Node current = head.next;
        
        while (current != tail) {
            for (int i = 0; i < current.count; i++) {
                arr[index++] = current.data[i];
            }
            current = current.next;
        }

        // Clear the list
        head.next = tail;
        tail.previous = head;
        size = 0;

        // Sort the array
        insertionSort(arr, new ElementComparator());

        // Rebuild the list
        for (E item : arr) {
            add(item);
        }
    }

    /**
     * Sort all elements in the stout list in the NON-INCREASING order. Call the bubbleSort()
     * method.  After sorting, all but (possibly) the last nodes must be filled with elements.  
     *  
     * Comparable<? super E> must be implemented for calling bubbleSort(). 
     */
    public void sortReverse() {
        if (size <= 1) return;

        // Copy elements to array
        E[] arr = (E[]) new Comparable[size];
        
        int index = 0;
        Node current = head.next;
        while (current != tail) {
            for (int i = 0; i < current.count; i++) {
                arr[index++] = current.data[i];
            }
            current = current.next;
        }

        // Clear the list
        head.next = tail;
        tail.previous = head;
        size = 0;

        // Sort the array
        bubbleSort(arr);

        // Rebuild the list
        for (E item : arr) {
            add(item);
        }
    }


    @Override
    public Iterator<E> iterator() {
    	return new StoutListIterator();
    }

    @Override
    public ListIterator<E> listIterator() {
        return new StoutListIterator();
    }

    @Override
    public ListIterator<E> listIterator(int index) {
        if (index < 0 || index > size) throw new IndexOutOfBoundsException();
        return new StoutListIterator(index);
    }

    /**
     * Returns a string representation of this list showing
     * the internal structure of the nodes.
     */
    public String toStringInternal() {
        return toStringInternal(null);
    }

    /**
     * Returns a string representation of this list showing the internal
     * structure of the nodes and the position of the iterator.
     *
     * @param iter an iterator for this list
     */
    public String toStringInternal(ListIterator<E> iter) {
        int count = 0;
        int position = -1;
        if (iter != null) {
            position = iter.nextIndex();
        }

        StringBuilder sb = new StringBuilder();
        sb.append('[');
        Node current = head.next;
        while (current != tail) {
            sb.append('(');
            E data = current.data[0];
            if (data == null) {
                sb.append("-");
            } else {
                if (position == count) {
                    sb.append("| ");
                    position = -1;
                }
                sb.append(data.toString());
                ++count;
            }

            for (int i = 1; i < nodeSize; ++i) {
                sb.append(", ");
                data = current.data[i];
                if (data == null) {
                    sb.append("-");
                } else {
                    if (position == count) {
                        sb.append("| ");
                        position = -1;
                    }
                    sb.append(data.toString());
                    ++count;

                    // iterator at end
                    if (position == size && count == size) {
                        sb.append(" |");
                        position = -1;
                    }
                }
            }
            sb.append(')');
            current = current.next;
            if (current != tail)
                sb.append(", ");
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Node type for this list. 
     * Each node holds a maximum of nodeSize elements in an array. 
     * Empty slots are null.
     */
    private class Node {
        /**
         * Array of actual data elements.
         */
        public E[] data = (E[]) new Comparable[nodeSize];

        /**
         * Link to next node.
         */
        public Node next;

        /**
         * Link to previous node;
         */
        public Node previous;

        /**
         * Index of the next available offset in this node, also
         * equal to the number of elements in this node.
         */
        public int count;

        /**
         * Adds an item to this node at the first available offset.
         * Precondition: count < nodeSize
         * @param item element to be added
         */
        void addItem(E item)
        {
          if (count >= nodeSize)
          {
            return;
          }
          data[count++] = item;
          // Useful for debugging
          // System.out.println("Added " + item.toString() + " at index " + count + " to node "  + Arrays.toString(data));
        }

        /**
         * Adds an item to this node at the indicated offset, shifting
         * elements to the right as necessary.
         * 
         * Precondition: count < nodeSize
         * @param offset array index at which to put the new element
         * @param item element to be added
         */
        void addItem(int offset, E item)
        {
          if (count >= nodeSize)
          {
        	  return;
          }
          for (int i = count - 1; i >= offset; --i)
          {
            data[i + 1] = data[i];
          }
          ++count;
          data[offset] = item;
          // Useful for debugging 
          // System.out.println("Added " + item.toString() + " at index " + offset + " to node: "  + Arrays.toString(data));
        }

        /**
         * Deletes an element from this node at the indicated offset,
         * shifting elements left as necessary.
         * Precondition: 0 <= offset < count
         * @param offset
         */
        void removeItem(int offset) {
            E item = data[offset];
            for (int i = offset + 1; i < nodeSize; ++i) {
                data[i - 1] = data[i];
            }
            data[count - 1] = null;
            --count;
        }
    }

    /**
     * Full list iterator implementation
     */
    private class StoutListIterator implements ListIterator<E> {
    	/**
		 * pointer of iterator
		 */
        private int currentIndex;
        /*
         * Current Node
         */
        private Node currentNode;
        /*
         * current Offset
         */
        private int currentOffset;
        
        /**
		 * tracks the lastAction taken by the program
		 */
        private int lastAction = -1;

        /**
		 * Default constructor
		 * Sets the pointer of iterator to the beginning of the list
		 */
        public StoutListIterator() {
            this(0);
        }

        /**
		 * Constructor finds node at a given position.
		 * Sets the pointer of iterator to the specific index of the list
		 * 
		 * @param pos
		 */
        public StoutListIterator(int pos) {
            if (pos < 0 || pos > size) throw new IndexOutOfBoundsException();

            currentIndex = pos;
            if (pos == size) {
                currentNode = tail;
                currentOffset = 0;
            } else {
                NodeInfo info = find(pos);
                currentNode = info.node;
                currentOffset = info.offset;
            }
        }

        /**
		 * @return whether iterator has next available value or not
		 */
        @Override
        public boolean hasNext() {
            return currentIndex < size;
        }

        /**
		 * Returns the next ready value and shifts the pointer by 1
		 * 
		 * @return the next ready value of the iterator
		 */
        @Override
        public E next() {
            if (!hasNext()) throw new NoSuchElementException();

            E item = currentNode.data[currentOffset];

            // Move to next position
            currentOffset++;
            if (currentOffset >= currentNode.count) {
                currentNode = currentNode.next;
                currentOffset = 0;
            }
            currentIndex++;
            lastAction = 1;

            return item;
        }
        
        /**
		 * Removes from the list the last element returned by next() or previous().
		 * Can only be called once per call of next() or previous()
		 */
        @Override
        public void remove() {
            if (lastAction == -1) throw new IllegalStateException();

            if (lastAction == 1) { // last was next()
                StoutList.this.remove(currentIndex - 1);
                currentIndex--;
            } else { // last was previous()
                StoutList.this.remove(currentIndex);
            }

            // Reset position based on current state
            NodeInfo info = find(currentIndex);
            currentNode = info.node;
            currentOffset = info.offset;

            lastAction = -1;
        }

        /**
		 * @return whether iterator has previous available value or not
		 */
        @Override
        public boolean hasPrevious() {
            return currentIndex > 0;
        }

        /**
		 * Returns previous available element and shifts pointer by -1
		 * 
		 * @return previous available element
		 */
        @Override
        public E previous() {
            if (!hasPrevious()) throw new NoSuchElementException();

            // Move to previous position
            currentOffset--;
            if (currentOffset < 0) {
                currentNode = currentNode.previous;
                currentOffset = currentNode.count - 1;
            }

            currentIndex--;
            lastAction = 0;

            return currentNode.data[currentOffset];
        }

        /**
		 * @return index of next available element
		 */
        @Override
        public int nextIndex() {
            return currentIndex;
        }

        /**
		 * @return index of previous element
		 */
        @Override
        public int previousIndex() {
            return currentIndex - 1;
        }

        /**
		 * Replaces the element at the current pointer
		 * 
		 * @param e replacing element
		 */
        @Override
        public void set(E e) {
            if (lastAction == -1) throw new IllegalStateException();
            if (e == null) throw new NullPointerException();

            if (lastAction == 1) { // last was next()
                currentNode.data[currentOffset - 1] = e;
            } else { // last was previous()
                currentNode.data[currentOffset] = e;
            }
        }

        /**
		 * Adds an element to the end of the list
		 * 
		 * @param e adding element
		 */
        @Override
        public void add(E e) {
            if (e == null) throw new NullPointerException();

            StoutList.this.add(currentIndex, e);
            currentIndex++;

            // Reset position based on current state
            NodeInfo info = find(currentIndex);
            currentNode = info.node;
            currentOffset = info.offset;

            lastAction = -1;
        }
    }

    /**
     * Insertion sort implementation
     */
    private void insertionSort(E[] arr, Comparator<? super E> comp) {
        for (int i = 1; i < arr.length; i++) {
            E key = arr[i];
            int j = i - 1;

            while (j >= 0 && comp.compare(arr[j], key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    /**
     * Bubble sort implementation in reverse order
     */
    private void bubbleSort(E[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j].compareTo(arr[j + 1]) < 0) {
                    // Swap
                    E temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    /**
     * Helper class to locate node and offset for a given index
     */
    private class NodeInfo {
        public Node node;
        public int offset;

        public NodeInfo(Node node, int offset) {
            this.node = node;
            this.offset = offset;
        }
    }

    /**
     * Finds the node and offset for a given logical index
     */
    private NodeInfo find(int pos) {
        if (pos < 0 || pos > size) throw new IndexOutOfBoundsException();

        Node current = head.next;
        int cumulative = 0;

        while (current != tail) {
            if (pos < cumulative + current.count) {
                return new NodeInfo(current, pos - cumulative);
            }
            cumulative += current.count;
            current = current.next;
        }

        return new NodeInfo(tail, 0);
    }

    /**
     * Comparator for natural ordering
     */
    private class ElementComparator implements Comparator<E> {
        @Override
        public int compare(E a, E b) {
            return a.compareTo(b);
        }
    }
}