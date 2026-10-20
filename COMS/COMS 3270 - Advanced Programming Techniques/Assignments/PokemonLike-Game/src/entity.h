#ifndef ENTITY_H
#define ENTITY_H

#include <limits.h>
#include "map.h"

typedef enum {
    player, // 0
    hiker, // 1
    rival, // 2
    pacer, // 3
    wanderer, // 4
    sentry, // 5
    explorer // 6
} entityType;

typedef struct Entity{
    int y, x;
    char standingOn, direction; // n, s, w, e
    entityType type;
} Entity;

typedef struct {
    Entity entity;
} Player;

typedef struct {
    int y, x;
    int distance;
    Entity *e;
} heapNode;

typedef struct {
    heapNode *nodes;
    int size, capacity;
} heap;

extern int hikerDistance[maxY][maxX];
extern int rivalDistance[maxY][maxX];

void initializePlayer(Player *pc, singleMap *map);
int getCost(entityType type, char terrain);
void heapInitialize(heap *h);
void heapPush(heap *h, Entity *e, int y, int x, int distance);
heapNode heapPop(heap *h);
void pathFinding(singleMap *map, Player *pc, entityType type, int dist[maxY][maxX]);
void initializeEntities(singleMap *map, int numTrainers);
void placeEntity(singleMap *map, entityType type, int index);
void entityMovementLoop(singleMap *map, Player *pc, int numTrainers);

#endif