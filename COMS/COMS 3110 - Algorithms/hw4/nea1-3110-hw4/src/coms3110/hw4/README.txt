Author: Neal Kaushik Sharma

Solution:

I modeled this as a graph problem. Cities that coexist get grouped together
using union-find (since coexistence is transitive). Then I build a directed
graph (It was mentioned on Piazza that it is supposed to be a directed graph)
where nodes are these groups and edges represent temporal ordering
(earlier group to later group).

Conflicts happen in two cases:
1) Two cities in the same group have an exclusivity statement between them
2) The ordering graph has a cycle

If either happens, return false. otherwise true.

The graph class uses hashset for adjacency lists (o(1) edge lookups) and
implements standard bfs/dfs/cycle detection algorithms from class.

Runtime: o(v + c + e) where v=cities, c=coexistence, e=exclusivity.