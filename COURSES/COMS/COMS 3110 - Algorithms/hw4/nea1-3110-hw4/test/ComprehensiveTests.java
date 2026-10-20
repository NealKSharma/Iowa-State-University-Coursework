import coms3110.hw4.Graph;
import coms3110.hw4.Analyzer;
import java.util.*;

public class ComprehensiveTests {

    private static int passCount = 0;
    private static int failCount = 0;

    public static void main(String[] args) {
        System.out.println("=".repeat(70));
        System.out.println("COMPREHENSIVE GRAPH AND ANALYZER TESTS");
        System.out.println("=".repeat(70));

        testGraphClass();
        testAnalyzerClass();

        System.out.println("\n" + "=".repeat(70));
        System.out.println("FINAL RESULTS: " + passCount + " passed, " + failCount + " failed");
        System.out.println("=".repeat(70));
    }

    // ===== GRAPH CLASS TESTS =====

    private static void testGraphClass() {
        System.out.println("\n### TESTING GRAPH CLASS ###\n");

        testGraphConstruction();
        testAddEdge();
        testReachability();
        testBFS();
        testDFS();
        testCycleDetection();
        testDiameter();
        testEdgeCases();
    }

    private static void testGraphConstruction() {
        System.out.println("--- Test: Graph Construction ---");

        List<String> vertices = Arrays.asList("A", "B", "C");
        Graph<String> g = new Graph<>(vertices);

        check("Vertex count", g.vertexCount() == 3);
        check("Initial edge count", g.edgeCount() == 0);

        // Test with different types
        Set<Integer> intSet = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));
        Graph<Integer> g2 = new Graph<>(intSet);
        check("Integer graph vertex count", g2.vertexCount() == 5);

        // Empty graph
        Graph<String> g3 = new Graph<>(new ArrayList<>());
        check("Empty graph", g3.vertexCount() == 0);

        System.out.println();
    }

    private static void testAddEdge() {
        System.out.println("--- Test: Adding Edges ---");

        Graph<String> g = new Graph<>(Arrays.asList("A", "B", "C", "D"));

        check("Add valid edge A->B", g.addEdge("A", "B") == true);
        check("Edge count after one add", g.edgeCount() == 1);

        check("Add duplicate edge A->B", g.addEdge("A", "B") == false);
        check("Edge count unchanged after duplicate", g.edgeCount() == 1);

        check("Add edge to non-existent vertex", g.addEdge("A", "Z") == false);
        check("Add edge from non-existent vertex", g.addEdge("Z", "A") == false);
        check("Edge count unchanged after invalid adds", g.edgeCount() == 1);

        check("Add reverse edge B->A", g.addEdge("B", "A") == true);
        check("Edge count after reverse", g.edgeCount() == 2);

        // Self-loop
        check("Add self-loop A->A", g.addEdge("A", "A") == true);
        check("Edge count after self-loop", g.edgeCount() == 3);

        System.out.println();
    }

    private static void testReachability() {
        System.out.println("--- Test: Reachability ---");

        Graph<String> g = new Graph<>(Arrays.asList("A", "B", "C", "D", "E"));
        g.addEdge("A", "B");
        g.addEdge("B", "C");
        g.addEdge("C", "D");
        g.addEdge("A", "E");

        // Direct reachability
        check("A reaches B (direct)", g.reachable("A", "B"));
        check("B reaches C (direct)", g.reachable("B", "C"));

        // Transitive reachability
        check("A reaches C (transitive)", g.reachable("A", "C"));
        check("A reaches D (transitive)", g.reachable("A", "D"));
        check("B reaches D (transitive)", g.reachable("B", "D"));

        // Not reachable (directed)
        check("B does NOT reach A", !g.reachable("B", "A"));
        check("D does NOT reach A", !g.reachable("D", "A"));
        check("E does NOT reach B", !g.reachable("E", "B"));

        // Self-reachability
        check("A reaches itself", g.reachable("A", "A"));
        check("E reaches itself", g.reachable("E", "E"));

        // Non-existent vertices
        check("Invalid source vertex", !g.reachable("Z", "A"));
        check("Invalid dest vertex", !g.reachable("A", "Z"));

        // Cycle reachability
        Graph<String> g2 = new Graph<>(Arrays.asList("X", "Y", "Z"));
        g2.addEdge("X", "Y");
        g2.addEdge("Y", "Z");
        g2.addEdge("Z", "X");
        check("X reaches Y in cycle", g2.reachable("X", "Y"));
        check("Y reaches X in cycle", g2.reachable("Y", "X"));
        check("Z reaches Y in cycle", g2.reachable("Z", "Y"));

        System.out.println();
    }

    private static void testBFS() {
        System.out.println("--- Test: BFS ---");

        Graph<String> g = new Graph<>(Arrays.asList("A", "B", "C", "D", "E", "F"));
        g.addEdge("A", "B");
        g.addEdge("A", "C");
        g.addEdge("B", "D");
        g.addEdge("C", "D");
        g.addEdge("D", "E");

        Map<String, Integer> layers = g.bfs("A");

        check("BFS from A: A at layer 0", layers.get("A") == 0);
        check("BFS from A: B at layer 1", layers.get("B") == 1);
        check("BFS from A: C at layer 1", layers.get("C") == 1);
        check("BFS from A: D at layer 2", layers.get("D") == 2);
        check("BFS from A: E at layer 3", layers.get("E") == 3);
        check("BFS from A: F unreachable", layers.get("F") == -1);

        // BFS from different start
        Map<String, Integer> layers2 = g.bfs("D");
        check("BFS from D: D at layer 0", layers2.get("D") == 0);
        check("BFS from D: E at layer 1", layers2.get("E") == 1);
        check("BFS from D: A unreachable", layers2.get("A") == -1);

        // BFS from isolated vertex
        Map<String, Integer> layers3 = g.bfs("F");
        check("BFS from F: F at layer 0", layers3.get("F") == 0);
        check("BFS from F: all others unreachable", layers3.get("A") == -1);

        // BFS from non-existent vertex
        Map<String, Integer> layers4 = g.bfs("Z");
        check("BFS from non-existent returns null", layers4 == null);

        System.out.println();
    }

    private static void testDFS() {
        System.out.println("--- Test: DFS ---");

        Graph<String> g = new Graph<>(Arrays.asList("A", "B", "C", "D"));
        g.addEdge("A", "B");
        g.addEdge("B", "C");
        g.addEdge("A", "D");

        Map<String, Integer> finishTimes = g.dfs();

        check("DFS returns finish times for all vertices", finishTimes.size() == 4);
        check("DFS finish times are positive", finishTimes.get("A") > 0);

        // Verify finish time properties (parent finishes after children)
        // In DFS, if A->B edge exists and B is visited from A, then finish(A) > finish(B)
        check("All vertices have finish times",
                finishTimes.containsKey("A") && finishTimes.containsKey("B") &&
                        finishTimes.containsKey("C") && finishTimes.containsKey("D"));

        // Test with cycle
        Graph<String> g2 = new Graph<>(Arrays.asList("X", "Y", "Z"));
        g2.addEdge("X", "Y");
        g2.addEdge("Y", "Z");
        g2.addEdge("Z", "X");

        Map<String, Integer> ft2 = g2.dfs();
        check("DFS on cycle returns finish times", ft2.size() == 3);

        System.out.println();
    }

    private static void testCycleDetection() {
        System.out.println("--- Test: Cycle Detection ---");

        // No cycle
        Graph<String> g1 = new Graph<>(Arrays.asList("A", "B", "C", "D"));
        g1.addEdge("A", "B");
        g1.addEdge("B", "C");
        g1.addEdge("C", "D");
        check("DAG has no cycle", !g1.hasCycle());

        // Simple cycle
        Graph<String> g2 = new Graph<>(Arrays.asList("A", "B", "C"));
        g2.addEdge("A", "B");
        g2.addEdge("B", "C");
        g2.addEdge("C", "A");
        check("Simple 3-cycle detected", g2.hasCycle());

        // Self-loop
        Graph<String> g3 = new Graph<>(Arrays.asList("A", "B"));
        g3.addEdge("A", "A");
        check("Self-loop is a cycle", g3.hasCycle());

        // Two-node cycle
        Graph<String> g4 = new Graph<>(Arrays.asList("A", "B"));
        g4.addEdge("A", "B");
        g4.addEdge("B", "A");
        check("Two-node cycle detected", g4.hasCycle());

        // Complex graph with cycle
        Graph<String> g5 = new Graph<>(Arrays.asList("A", "B", "C", "D", "E"));
        g5.addEdge("A", "B");
        g5.addEdge("B", "C");
        g5.addEdge("C", "D");
        g5.addEdge("D", "E");
        g5.addEdge("E", "B"); // Creates cycle B->C->D->E->B
        check("Complex graph cycle detected", g5.hasCycle());

        // Disconnected components, one has cycle
        Graph<String> g6 = new Graph<>(Arrays.asList("A", "B", "C", "D"));
        g6.addEdge("A", "B");
        g6.addEdge("B", "A"); // Cycle in first component
        g6.addEdge("C", "D");  // No cycle in second component
        check("Cycle in one component detected", g6.hasCycle());

        // No edges
        Graph<String> g7 = new Graph<>(Arrays.asList("A", "B", "C"));
        check("Graph with no edges has no cycle", !g7.hasCycle());

        System.out.println();
    }

    private static void testDiameter() {
        System.out.println("--- Test: Diameter ---");

        // Single vertex
        Graph<String> g1 = new Graph<>(Arrays.asList("A"));
        check("Single vertex diameter is 0", g1.diameter() == 0);

        // Two connected vertices
        Graph<String> g2 = new Graph<>(Arrays.asList("A", "B"));
        g2.addEdge("A", "B");
        g2.addEdge("B", "A");
        check("Two fully connected vertices diameter is 1", g2.diameter() == 1);

        // Linear chain (directed, not all reachable)
        Graph<String> g3 = new Graph<>(Arrays.asList("A", "B", "C"));
        g3.addEdge("A", "B");
        g3.addEdge("B", "C");
        check("Linear directed chain diameter is -1", g3.diameter() == -1);

        // Fully connected (all vertices reach all others)
        Graph<String> g4 = new Graph<>(Arrays.asList("A", "B", "C"));
        g4.addEdge("A", "B");
        g4.addEdge("A", "C");
        g4.addEdge("B", "A");
        g4.addEdge("B", "C");
        g4.addEdge("C", "A");
        g4.addEdge("C", "B");
        check("Fully connected 3-vertex diameter is 1", g4.diameter() == 1);

        // Cycle (all vertices reach all others)
        Graph<String> g5 = new Graph<>(Arrays.asList("A", "B", "C", "D"));
        g5.addEdge("A", "B");
        g5.addEdge("B", "C");
        g5.addEdge("C", "D");
        g5.addEdge("D", "A");
        check("4-cycle diameter is 3", g5.diameter() == 3);

        // Disconnected graph
        Graph<String> g6 = new Graph<>(Arrays.asList("A", "B", "C", "D"));
        g6.addEdge("A", "B");
        g6.addEdge("C", "D");
        check("Disconnected graph diameter is -1", g6.diameter() == -1);

        System.out.println();
    }

    private static void testEdgeCases() {
        System.out.println("--- Test: Edge Cases ---");

        // Large vertex set
        List<Integer> largeSet = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            largeSet.add(i);
        }
        Graph<Integer> g1 = new Graph<>(largeSet);
        check("Large graph construction", g1.vertexCount() == 1000);

        // Many edges
        Graph<String> g2 = new Graph<>(Arrays.asList("A", "B", "C"));
        for (int i = 0; i < 100; i++) {
            g2.addEdge("A", "B"); // Should only add once
        }
        check("Duplicate edge prevention", g2.edgeCount() == 1);

        // Custom objects as vertices
        List<Point> points = Arrays.asList(
                new Point(0, 0),
                new Point(1, 1),
                new Point(2, 2)
        );
        Graph<Point> g3 = new Graph<>(points);
        Point p1 = points.get(0);
        Point p2 = points.get(1);
        g3.addEdge(p1, p2);
        check("Custom object vertices", g3.reachable(p1, p2));

        System.out.println();
    }

    // ===== ANALYZER CLASS TESTS =====

    private static void testAnalyzerClass() {
        System.out.println("\n### TESTING ANALYZER CLASS ###\n");

        String[] testFiles = {
                "test1.txt", "test2.txt", "test3.txt", "test4.txt", "test5.txt",
                "test6.txt", "test7.txt", "test8.txt", "test9.txt", "test10.txt",
                "test11.txt", "test12.txt", "test13.txt", "test14.txt", "test15.txt",
                "test16.txt", "test17.txt", "test18.txt", "test19.txt", "test20.txt"
        };

        boolean[] expected = {
                true,   // test1: coexistence groups
                false,  // test2: same group conflict
                false,  // test3: simple cycle
                true,   // test4: linear timeline
                false,  // test5: transitive conflict
                true,   // test6: disconnected groups
                true,   // test7: empty statements
                false,  // test8: direct cycle
                true,   // test9: complex valid
                false,  // test10: long cycle
                false,  // test11: complex transitive conflict
                true,   // test12: star topology
                false,  // test13: hidden cycle
                true,   // test14: many isolated cities
                false,  // test15: complex contradiction
                true,   // test16: long valid chain
                false,  // test17: immediate contradiction
                true,   // test18: complex valid web
                false,  // test19: subtle transitive cycle
                true    // test20: maximal coexistence
        };

        for (int i = 0; i < testFiles.length; i++) {
            String file = testFiles[i];
            file = "nea1-3110-hw4/test/testFiles/" + file;
            try {
                boolean result = Analyzer.analyze(file);
                check("Analyzer: " + file, result == expected[i]);
            } catch (Exception e) {
                System.out.println("  ✗ ERROR on " + file + ": " + e.getMessage());
                failCount++;
            }
        }

        System.out.println();
    }

    // Helper methods

    private static void check(String testName, boolean condition) {
        if (condition) {
            System.out.println("  ✓ " + testName);
            passCount++;
        } else {
            System.out.println("  ✗ FAIL: " + testName);
            failCount++;
        }
    }

    // Helper class for testing custom objects
    static class Point {
        int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Point)) return false;
            Point p = (Point) o;
            return x == p.x && y == p.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }
}