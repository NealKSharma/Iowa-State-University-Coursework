package coms3110.hw4;

import java.io.*;
import java.util.*;

public class Analyzer {

    public static boolean analyze(String filePath) throws Exception {
        List<String> cities = new ArrayList<>();
        List<String[]> coexist = new ArrayList<>();
        List<String[]> exclusive = new ArrayList<>();

        // read the file
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            int cityCount = Integer.parseInt(reader.readLine().trim());
            for (int i = 0; i < cityCount; i++) {
                cities.add(reader.readLine().trim());
            }

            int coexistCount = Integer.parseInt(reader.readLine().trim());
            for (int i = 0; i < coexistCount; i++) {
                String[] pair = reader.readLine().trim().split("\\s+");
                coexist.add(pair);
            }

            int exclusiveCount = Integer.parseInt(reader.readLine().trim());
            for (int i = 0; i < exclusiveCount; i++) {
                String[] pair = reader.readLine().trim().split("\\s+");
                exclusive.add(pair);
            }
        } catch (IOException e) {
            throw new Exception("Error reading file: " + e.getMessage());
        } catch (NumberFormatException e) {
            throw new Exception("Malformed file: invalid number format");
        }

        // group cities that coexisted together
        UnionFind groups = new UnionFind(cities);

        for (String[] pair : coexist) {
            groups.union(pair[0], pair[1]);
        }

        // get all the unique groups
        Set<String> groupSet = new HashSet<>();
        for (String city : cities) {
            groupSet.add(groups.find(city));
        }

        // build graph where nodes are groups
        Graph<String> ordering = new Graph<>(groupSet);

        // add edges for temporal ordering
        for (String[] pair : exclusive) {
            String earlier = pair[0];
            String later = pair[1];

            String earlierGroup = groups.find(earlier);
            String laterGroup = groups.find(later);

            // cant coexist and also be exclusive
            if (earlierGroup.equals(laterGroup)) {
                return false;
            }

            ordering.addEdge(earlierGroup, laterGroup);
        }

        // cycles mean impossible timeline
        if (ordering.hasCycle()) {
            return false;
        }

        return true;
    }

    // union find to handle coexistence groups
    private static class UnionFind {
        private Map<String, String> parent;
        private Map<String, Integer> rank;

        public UnionFind(List<String> items) {
            parent = new HashMap<>();
            rank = new HashMap<>();

            for (String item : items) {
                parent.put(item, item);
                rank.put(item, 0);
            }
        }

        public String find(String x) {
            // path compression
            if (!parent.get(x).equals(x)) {
                parent.put(x, find(parent.get(x)));
            }
            return parent.get(x);
        }

        public void union(String x, String y) {
            String rootX = find(x);
            String rootY = find(y);

            if (rootX.equals(rootY)) {
                return;
            }

            // union by rank
            int rankX = rank.get(rootX);
            int rankY = rank.get(rootY);

            if (rankX < rankY) {
                parent.put(rootX, rootY);
            } else if (rankX > rankY) {
                parent.put(rootY, rootX);
            } else {
                parent.put(rootY, rootX);
                rank.put(rootX, rankX + 1);
            }
        }
    }
}