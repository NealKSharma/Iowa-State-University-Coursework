package coms3110.hw4;

import java.util.*;

public class Graph<T> {
    private Map<T, Set<T>> adjList;
    private Set<T> vertices;
    private int numEdges;

    public Graph(Collection<T> verts) {
        this.vertices = new HashSet<>(verts);
        this.adjList = new HashMap<>();
        this.numEdges = 0;

        // setup empty adjacency sets
        for (T v : verts) {
            adjList.put(v, new HashSet<>());
        }
    }

    public boolean addEdge(T from, T to) {
        // both vertices need to exist
        if (!vertices.contains(from) || !vertices.contains(to)) {
            return false;
        }

        Set<T> neighbors = adjList.get(from);
        // dont add duplicate edges
        if (neighbors.contains(to)) {
            return false;
        }

        neighbors.add(to);
        numEdges++;
        return true;
    }

    public int vertexCount() {
        return vertices.size();
    }

    public int edgeCount() {
        return numEdges;
    }

    public boolean reachable(T from, T to) {
        if (!vertices.contains(from) || !vertices.contains(to)) {
            return false;
        }

        if (from.equals(to)) {
            return true;
        }

        // just do bfs to check if we can reach it
        Set<T> visited = new HashSet<>();
        Queue<T> queue = new LinkedList<>();
        queue.add(from);
        visited.add(from);

        while (!queue.isEmpty()) {
            T current = queue.poll();

            for (T neighbor : adjList.get(current)) {
                if (neighbor.equals(to)) {
                    return true;
                }
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }

        return false;
    }

    public Map<T, Integer> bfs(T start) {
        if (!vertices.contains(start)) {
            return null;
        }

        Map<T, Integer> layers = new HashMap<>();

        // init everything to -1 for unreachable
        for (T v : vertices) {
            layers.put(v, -1);
        }

        Queue<T> queue = new LinkedList<>();
        queue.add(start);
        layers.put(start, 0);

        while (!queue.isEmpty()) {
            T current = queue.poll();
            int currentLayer = layers.get(current);

            for (T neighbor : adjList.get(current)) {
                if (layers.get(neighbor) == -1) {
                    layers.put(neighbor, currentLayer + 1);
                    queue.add(neighbor);
                }
            }
        }

        return layers;
    }

    public int diameter() {
        int maxDist = 0;

        // try bfs from every vertex
        for (T vertex : vertices) {
            Map<T, Integer> distances = bfs(vertex);

            for (T other : vertices) {
                int dist = distances.get(other);

                // if anything is unreachable then diameter is undefined
                if (dist == -1) {
                    return -1;
                }

                if (dist > maxDist) {
                    maxDist = dist;
                }
            }
        }

        return maxDist;
    }

    public Map<T, Integer> dfs() {
        Map<T, Integer> finishTimes = new HashMap<>();
        Set<T> visited = new HashSet<>();
        int[] time = {0};

        // visit all vertices
        for (T vertex : vertices) {
            if (!visited.contains(vertex)) {
                dfsVisit(vertex, visited, finishTimes, time);
            }
        }

        return finishTimes;
    }

    private void dfsVisit(T vertex, Set<T> visited, Map<T, Integer> finishTimes, int[] time) {
        visited.add(vertex);
        time[0]++;  // discovery time

        // recursively visit neighbors
        for (T neighbor : adjList.get(vertex)) {
            if (!visited.contains(neighbor)) {
                dfsVisit(neighbor, visited, finishTimes, time);
            }
        }

        time[0]++;  // finish time
        finishTimes.put(vertex, time[0]);
    }

    public boolean hasCycle() {
        Set<T> visited = new HashSet<>();
        Set<T> stack = new HashSet<>();

        for (T vertex : vertices) {
            if (!visited.contains(vertex)) {
                if (checkCycle(vertex, visited, stack)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean checkCycle(T vertex, Set<T> visited, Set<T> stack) {
        visited.add(vertex);
        stack.add(vertex);

        for (T neighbor : adjList.get(vertex)) {
            if (!visited.contains(neighbor)) {
                if (checkCycle(neighbor, visited, stack)) {
                    return true;
                }
            } else if (stack.contains(neighbor)) {
                // back edge means cycle
                return true;
            }
        }

        stack.remove(vertex);
        return false;
    }
}