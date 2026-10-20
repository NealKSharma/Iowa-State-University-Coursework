#ifndef MAP_H
#define MAP_H

#define maxY 21
#define maxX 80

typedef struct {
    int mapY, mapX, nGate, sGate, eGate, wGate;
    struct Entity **entityList;
    char terrain[maxY][maxX];
} singleMap;

typedef struct {
    int x, y;
} queueNode;

void setupMap(singleMap *map);
void printMap(singleMap *map);
void generatePaths(singleMap *map, int n, int s, int w, int e);
void generateBuildings(singleMap *map, char pokeMart, char pokeCentre);
void generateTerrain(singleMap *map);
void addToQueue(singleMap *map, int nextX, int nextY, int currentX, int currentY, queueNode queue[], int *tail);

#endif