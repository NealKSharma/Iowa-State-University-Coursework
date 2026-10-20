package edu.iastate.cs2280.hw4;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Stack;

/**
 * This class reconstructs a message archived with a binary-tree-based algorithm.
 * It uses an iterative approach to build the decoding tree from the encoding string,
 * and provides statistics about the compression.
 * 
 * Implemented iterative tree construction and statistics printing.
 * 
 * @author Neal Kaushik Sharma
 */
public class MsgTree {
	/*
	 * Character that this node in the tree represents
	 */
    public char payloadChar;
    /*
	 * Left subtree, a '0' in the encoded message
	 */
    public MsgTree left;
    /*
	 * Right subtree, a '1' in the encoded message
	 */
    public MsgTree right;
    
    // Static variables for file processing
    /*
	 * String representation of the binary encoding for the message
	 */
    private static String encodingStr;
    /*
	 * String placeholder of the encoded message
	 */
    private static String messageStr;
    /*
	 * File that contains the encoded message
	 */
    private static String filename;
    
    /**
     * Constructor for a single node with null children
     * 
     * @param payloadChar The character to be stored in this node
     */
    public MsgTree(char payloadChar) {
        this.payloadChar = payloadChar;
        this.left = null;
        this.right = null;
    }
    
    /**
     * Constructor building the tree from a string using an iterative approach
     * This is implemented iteratively for the 15% bonus
     * 
     * @param encodingString The string representing the preorder traversal of the tree
     */
    public MsgTree(String encodingString) {
        if (encodingString == null || encodingString.isEmpty()) {
            return;
        }
        
        // Create root node with first character
        char rootChar = encodingString.charAt(0);
        payloadChar = rootChar;
        
        if (encodingString.length() == 1) {
            return; // Single node tree
        }
        
        // Use stacks to build the tree iteratively
        Stack<MsgTree> nodeStack = new Stack<>();
        Stack<Integer> stateStack = new Stack<>(); // 0 = need left child, 1 = need right child
        
        nodeStack.push(this);
        stateStack.push(0);
        
        int index = 1;
        while (index < encodingString.length() && !nodeStack.isEmpty()) {
            char c = encodingString.charAt(index++);
            MsgTree node = new MsgTree(c);
            
            MsgTree parent = nodeStack.peek();
            int state = stateStack.pop();
            
            if (state == 0) {
                // Add as left child
                parent.left = node;
                stateStack.push(1); // Next we need right child
                
                if (c == '^') {
                    // This is an internal node, push it to stack
                    nodeStack.push(node);
                    stateStack.push(0); // First need left child
                }
            } else {
                // Add as right child
                parent.right = node;
                nodeStack.pop(); // Done with this parent
                
                if (c == '^') {
                    // This is an internal node, push it to stack
                    nodeStack.push(node);
                    stateStack.push(0); // First need left child
                } 
            }
        }
    }
    
    /**
     * Method to print characters and their binary codes
     * Uses recursive preorder traversal to print the codes
     * 
     * @param root The root of the tree or subtree
     * @param code The binary code accumulated so far
     */
    public static void printCodes(MsgTree root, String code) {
        if (root == null) return;
        
        // If this is a leaf node, print the character and its code
        if (root.payloadChar != '^') {
            String charDisplay;
            switch (root.payloadChar) {
                case '\n':
                    charDisplay = "\\n";
                    break;
                case '\r':
                    charDisplay = "\\r";
                    break;
                case '\t':
                    charDisplay = "\\t";
                    break;
                case ' ':
                    charDisplay = "' '";
                    break;
                default:
                    charDisplay = String.valueOf(root.payloadChar);
            }
            System.out.println(charDisplay + "\t\t\t" + code);
            return;
        }
        
        // Recursively process left and right subtrees
        printCodes(root.left, code + "0");
        printCodes(root.right, code + "1");
    }
    
    /**
     * Decodes a message using the given code tree
     * 
     * @param codes The root of the code tree
     * @param msg The binary message to decode
     * @return The decoded message
     */
    public static String decode(MsgTree codes, String msg) {
        String decodedMessage = "";
        MsgTree currentNode = codes;
        
        for (int i = 0; i < msg.length(); i++) {
            char bit = msg.charAt(i);
            
            // Move left for '0', right for '1'
            if (bit == '0') {
                currentNode = currentNode.left;
            } else if (bit == '1') {
                currentNode = currentNode.right;
            }
            
            // If we've reached a leaf node, add its character to the result
            if (currentNode != null && (currentNode.left == null || currentNode.right == null)) {
                decodedMessage += currentNode.payloadChar;
                currentNode = codes; // Go back to the root for the next character
            }
        }
        
        // When we end at a leaf
        if (currentNode != codes) {
            decodedMessage += currentNode.payloadChar;
        }
        
        return decodedMessage;
    }
    
    /**
     * Checks if a file has the .arch extension
     * 
     * @param filename The name of the file to check
     * @return true if the file has the .arch extension, false otherwise
     */
    private static boolean hasArchExtension(String filename) {
        return filename != null && filename.toLowerCase().endsWith(".arch");
    }
    
    /**
     * Reads and processes the archive file
     * 
     * @throws FileNotFoundException If the file doesn't exist
     */
    private static void readAndProcessFile() throws FileNotFoundException {
        try (Scanner scanner = new Scanner(new File(filename))) {
            String tempEncodingStr = "";
            
            // First line is always part of the encoding string
            if (scanner.hasNextLine()) {
                tempEncodingStr += scanner.nextLine();
            }
            
            boolean foundMessage = false;
            
            // Process subsequent lines
            while (scanner.hasNextLine() && !foundMessage) {
                String line = scanner.nextLine();
                
                // Check if the line is binary (only 0s and 1s)
                boolean isBinary = true;
                for (int i = 0; i < line.length(); i++) {
                    if (line.charAt(i) != '0' && line.charAt(i) != '1') {
                        isBinary = false;
                        break;
                    }
                }
                
                if (isBinary) {
                    messageStr = line.trim();
                    foundMessage = true;
                } else {
                    // If not binary, it's part of the encoding string (might contain newlines)
                    tempEncodingStr += line;
                }
            }
            
            encodingStr = tempEncodingStr;
            
            // If we haven't found the message yet, try one more line
            if (!foundMessage && scanner.hasNextLine()) {
                messageStr = scanner.nextLine().trim();
            }
            
        } catch (FileNotFoundException e) {
            throw new FileNotFoundException("The file '" + filename + "' does not exist.");
        }
    }
    
    /**
     * Prints statistics about the compression
     * Part of the 5% extra credit
     * 
     * @param encoded The encoded message
     * @param decoded The decoded message
     */
    public static void printStatistics(String encoded, String decoded) {
        System.out.println();
        System.out.println("STATISTICS:");
        
        // Calculate average bits per character
        double avgBits = (double) encoded.length() / decoded.length();
        System.out.printf("Avg bits/char:\t\t%.1f%n", avgBits);
        
        // Print total characters
        System.out.println("Total characters:\t" + decoded.length());
        
        // Calculate space savings according to the formula in the PDF
        // Space savings = (1 - compressedBits/uncompressedBits) * 100
        // where uncompressedBits = decoded.length() * 16
        double uncompressedBits = decoded.length() * 16.0;
        double compressedBits = encoded.length();
        double spaceSavings = (1 - compressedBits / uncompressedBits) * 100;
        System.out.printf("Space savings:\t\t%.1f%%%n", spaceSavings);
    }
    
    /**
     * Main method that runs the program
     * 
     * @param args Command line arguments (not used)
     */
    public static void main(String[] args) {
        // Prompt the user for filename
        Scanner inputScanner = new Scanner(System.in);
        System.out.print("Please enter filename to decode: ");
        filename = inputScanner.nextLine().trim();
        inputScanner.close();
        
        try {
            // Check if the file exists
            File file = new File(filename);
            if (!file.exists()) {
                throw new FileNotFoundException("File '" + filename + "' does not exist.");
            }
            
            // Check if the file has the correct extension
            if (!hasArchExtension(filename)) {
                throw new FileNotFoundException("File '" + filename + "' is incorrect file type. Must have .arch extension needed per specifications.");
            }
            
            // Read and process the file
            readAndProcessFile();
            
            // Build the tree
            MsgTree tree = new MsgTree(encodingStr);
            
            // Print the codes
            System.out.println("character\tcode");
            System.out.println("-------------------------");
            printCodes(tree, "");
            
            // Decode and print the message
            System.out.println("\nMESSAGE:");
            String decodedMessage = decode(tree, messageStr);
            System.out.println(decodedMessage);
            
            // Print statistics (extra credit - 5%)
            printStatistics(messageStr, decodedMessage);
            
        } catch (FileNotFoundException e) {
            System.out.println(e.getMessage());
        }
    }
}