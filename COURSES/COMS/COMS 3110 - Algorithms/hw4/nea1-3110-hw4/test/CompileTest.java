import coms3110.hw4.Analyzer;
import coms3110.hw4.Graph;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
public class CompileTest {
    public static void main(String []args) {
        ArrayList<String> v1 = new ArrayList<>();
        v1.add("v0");
        v1.add("v1");
        v1.add("v2");
        Graph<String> g1 = new coms3110.hw4.Graph<>(v1);
        Map<String, Integer> layers = g1.bfs("v0");
        HashSet<Float> v2 = new HashSet<>();
        v2.add(1.0F);
        v2.add(2.0F);
        v2.add(3.0F);
        Graph<Float> g2 = new coms3110.hw4.Graph<>(v2);
        g2.addEdge(1.0F, 2.0F);
        Map<Float, Integer> finishTimes = g2.dfs();
        try {
            boolean consistent = Analyzer.analyze("nea1-3110-hw4/test/testFiles/test1.txt");
        } catch (Exception e) {
            System.out.println("File not found.");
        }
    }
}