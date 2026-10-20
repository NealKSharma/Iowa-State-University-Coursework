#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <unistd.h>
#include "entity.h"
#include "map.h"

int hikerDistance[maxY][maxX];
int rivalDistance[maxY][maxX];

static const int move_costs[7][8] = {
    // Terrain: 0:#, 1:M, 2:C, 3::, 4:., 5:^, 6:*, 7:Default
    {5, 30, 30, 15, 10, 20, 15, INT_MAX}, // Player
    {10, 50, 50, 15, 10, 15, 15, INT_MAX}, // Hiker
    {10, 50, 50, 20, 10, INT_MAX, 15, INT_MAX}, // Rival
    {5, 20, 20, 10, 5, INT_MAX, 10, INT_MAX}, // Pacer
    {10, 50, 50, 15, 10, INT_MAX, 10, INT_MAX}, // Wanderer
    {10, 50, 50, 20, 10, INT_MAX, 15, INT_MAX}, // Sentry (Doesn't really do anything)
    {10, 50, 50, 15, 15, INT_MAX, 10, INT_MAX} // Explorer
};

void initializePlayer(Player *pc, singleMap *map){
    pc->entity.type = player;
    // Can only be placed on a path
    int y, x;
    while(1){
        y = rand() % (maxY - 2) + 1;
        x = rand() % (maxX - 2) + 1;
        if(map->terrain[y][x] == '#'){
            pc->entity.y = y;
            pc->entity.x = x;
            pc->entity.standingOn = map->terrain[y][x];
            map->terrain[y][x] = '@';
            break;
        }
    }
}

int getCost(entityType type, char terrain) {
    int terrainIndex;
    // Map the character to a column index
    switch(terrain) {
        case '#': terrainIndex = 0; break; // Path
        case 'M': terrainIndex = 1; break; // Pokemart
        case 'C': terrainIndex = 2; break; // Pokecenter
        case ':': terrainIndex = 3; break; // Tall Grass
        case '.': terrainIndex = 4; break; // Clearing
        case '^': terrainIndex = 5; break; // Trees
        case '*': terrainIndex = 6; break; // Flower
        default:  terrainIndex = 7; break; // INT_MAX
    }

    if (type < 0 || type > 6) return INT_MAX;
    return move_costs[type][terrainIndex];
}

void heapInitialize(heap *h){
    h->capacity = 256; // Is increased further
    h->size = 0;
    h->nodes = malloc(sizeof(heapNode) * h->capacity);
}

void heapPush(heap *h, Entity *e, int y, int x, int distance){
    if (h->size >= h->capacity) {
        h->capacity *= 2;
        h->nodes = realloc(h->nodes, sizeof(heapNode) * h->capacity);
    }

    int i = h->size++;
    while(i > 0 && h->nodes[(i - 1) / 2].distance > distance){
        h->nodes[i] = h->nodes[(i - 1) / 2];
        i = (i - 1) / 2;
    }
    h->nodes[i].y = y;
    h->nodes[i].x = x;
    h->nodes[i].e = e;
    h->nodes[i].distance = distance;
}

heapNode heapPop(heap *h) {
    heapNode min = h->nodes[0];
    h->size--; 
    
    if (h->size > 0) {
        heapNode last = h->nodes[h->size];
        int i = 0, child;
        while ((child = i * 2 + 1) < h->size) {
            if (child + 1 < h->size && h->nodes[child + 1].distance < h->nodes[child].distance) {
                child++;
            }
            if (last.distance <= h->nodes[child].distance) break;
            h->nodes[i] = h->nodes[child];
            i = child;
        }
        h->nodes[i] = last;
    }
    return min;
}

void pathFinding(singleMap *map, Player *pc, entityType type, int dist[maxY][maxX]){
    heap h;
    heapInitialize(&h);

    for(int i = 0; i < maxY; i++){
        for(int j = 0; j < maxX; j++){
            dist[i][j] = INT_MAX; // Set distances to Int Max.
        }
    }
    // Set player's location to 0 distance.
    dist[pc->entity.y][pc->entity.x] = 0;
    heapPush(&h, NULL, pc->entity.y, pc->entity.x, 0);

    while(h.size > 0){
        heapNode curr = heapPop(&h);
        if(curr.distance > dist[curr.y][curr.x]) continue;

        // Check the different directions
        for(int dy = -1; dy <= 1; dy++){
            for (int dx = -1; dx <= 1; dx++){
                if(dy == 0 && dx == 0) continue; // Skip the current tile
                int neighborY = curr.y + dy;
                int neighborX = curr.x + dx;

                if(neighborY > 0 && neighborY < maxY - 1 && neighborX > 0 && neighborX < maxX - 1){
                    char terrain = map->terrain[neighborY][neighborX];
                    int moveCost = getCost(type, terrain);
                    if(moveCost != INT_MAX){
                        int newDist = dist[curr.y][curr.x] + moveCost;
                        if(newDist < dist[neighborY][neighborX]){
                            dist[neighborY][neighborX] = newDist;
                            heapPush(&h, NULL, neighborY, neighborX, newDist);
                        }
                    }
                }
            }
        }
    }
    free(h.nodes);
}

void initializeEntities(singleMap *map, int numTrainers){
    if (numTrainers <= 0) return;

    map->entityList = malloc(numTrainers * sizeof(Entity *));
    if(!map->entityList) return;

    int index = 0;
    int random;
    if (numTrainers < 2) {
        random = rand() % 2;
        if(random == 0) placeEntity(map, hiker, index++);
        else placeEntity(map, rival, index++);
    } else {
        placeEntity(map, hiker, index++);
        placeEntity(map, rival, index++);
        numTrainers -= 2;
        while(numTrainers > 0){
            entityType type = (1 + rand() % 6);
            placeEntity(map, type, index++);
            numTrainers--;
        }
    }
}

void placeEntity(singleMap *map, entityType type, int index){
    Entity *npc = malloc(sizeof(Entity));
    if(!npc) return;

    int y = rand() % (maxY - 2) + 1;
    int x = rand() % (maxX - 2) + 1;
    while(getCost(type, map->terrain[y][x]) == INT_MAX){
        y = rand() % (maxY - 2) + 1;
        x = rand() % (maxX - 2) + 1;
    }
    npc->y = y;
    npc->x = x;
    npc->type = type;
    npc->standingOn = map->terrain[y][x];
    switch(type){
        case 1: map->terrain[y][x] = 'h'; break;
        case 2: map->terrain[y][x] = 'r';break;
        case 3: map->terrain[y][x] = 'p';break;
        case 4: map->terrain[y][x] = 'w';break;
        case 5: map->terrain[y][x] = 's';break;
        case 6: map->terrain[y][x] = 'e';break;
        default: break;
    }
    map->entityList[index] = (struct Entity *)npc;
}

void entityMovementLoop(singleMap *map, Player *pc, int numTrainers){
    heap h;
    heapInitialize(&h);
    pathFinding(map, pc, hiker, hikerDistance);
    pathFinding(map, pc, rival, rivalDistance);

    heapPush(&h, &pc->entity, pc->entity.y, pc->entity.x, 0);

    for(int i = 0; i < numTrainers; i++){
        Entity *npc = (Entity *)map->entityList[i];
        char dirs[] = {'n', 's', 'e', 'w'};
        npc->direction = dirs[rand() % 4];
        heapPush(&h, npc, npc->y, npc->x, 0);
    }

    while(1){
        heapNode top = heapPop(&h);
        Entity *e = top.e;
        int currentTime = top.distance;
        int nextY = e->y;
        int nextX = e->x;

        if(e->type == player){
            printMap(map);
            usleep(250000);
            pathFinding(map, pc, hiker, hikerDistance);
            pathFinding(map, pc, rival, rivalDistance);
            // Random movement of the player
            nextY = e->y + (rand() % 3) - 1;
            nextX = e->x + (rand() % 3) - 1;
            while(nextY <= 0 || nextY >= maxY-1 || nextX <= 0 || nextX >= maxX-1 || getCost(player, map->terrain[nextY][nextX]) == INT_MAX){
                nextY = e->y + (rand() % 3) - 1;
                nextX = e->x + (rand() % 3) - 1;
            }
        } else {
            switch(e->type){
                case hiker:
                case rival: {
                    int minDist = INT_MAX;
                    for(int changeY = -1; changeY <= 1; changeY++){
                        for(int changeX = -1; changeX <= 1; changeX++){
                            if(changeY == 0 && changeX == 0) continue;
                            if (e->y + changeY <= 0 || e->y + changeY >= maxY-1 || e->x + changeX <= 0 || e->x + changeX >= maxX-1) continue;
                            if(getCost(e->type, map->terrain[e->y + changeY][e->x + changeX]) != INT_MAX){
                                int dist = (e->type == hiker) ? hikerDistance[e->y + changeY][e->x + changeX] : rivalDistance[e->y + changeY][e->x + changeX];
                                if(dist < minDist){
                                    minDist = dist;
                                    nextY = e->y + changeY;
                                    nextX = e->x + changeX;
                                }
                            }
                        }
                    }
                    break;
                }
                case pacer:{
                    int changeY = (e->direction == 'n') ? -1 : (e->direction == 's') ? 1 : 0;
                    int changeX = (e->direction == 'w') ? -1 : (e->direction == 'e') ? 1 : 0;
                    char newTerrain = map->terrain[e->y + changeY][e->x + changeX];
                    if (e->y + changeY <= 0 || e->y + changeY >= maxY-1 || e->x + changeX <= 0 || e->x + changeX >= maxX-1 
                        || getCost(pacer, newTerrain) == INT_MAX){
                        if(e->direction == 'n') e->direction = 's';
                        else if(e->direction == 's') e->direction = 'n';
                        else if(e->direction == 'e') e->direction = 'w';
                        else if(e->direction == 'w') e->direction = 'e';
                    }
                    nextY = e->y + ((e->direction == 'n') ? -1 : (e->direction == 's') ? 1 : 0);
                    nextX = e->x + ((e->direction == 'w') ? -1 : (e->direction == 'e') ? 1 : 0);
                    break;
                }
                case explorer:
                case wanderer: {
                    int changeY = (e->direction == 'n') ? -1 : (e->direction == 's') ? 1 : 0;
                    int changeX = (e->direction == 'w') ? -1 : (e->direction == 'e') ? 1 : 0;
                    char newTerrain = map->terrain[e->y + changeY][e->x + changeX];
                    while (e->y + changeY <= 0 || e->y + changeY >= maxY-1 || e->x + changeX <= 0 || e->x + changeX >= maxX-1 
                        || getCost(e->type, newTerrain) == INT_MAX || (e->type == wanderer && newTerrain != e->standingOn)) { 
                        char dirs[] = {'n', 's', 'e', 'w'};
                        char newDir = dirs[rand() % 4];
                        while(e->direction == newDir) newDir = dirs[rand() % 4];
                        e->direction = newDir;
                        changeY = (e->direction == 'n') ? -1 : (e->direction == 's') ? 1 : 0;
                        changeX = (e->direction == 'w') ? -1 : (e->direction == 'e') ? 1 : 0;
                        newTerrain = map->terrain[e->y + changeY][e->x + changeX];
                    }
                    nextY = e->y + changeY;
                    nextX = e->x + changeX;
                    break;
                }
                case sentry: break;
                default: break;
            }
        }

        if(getCost(e->type, map->terrain[nextY][nextX]) != INT_MAX){
            map->terrain[e->y][e->x] = e->standingOn;
            e->y = nextY;
            e->x = nextX;
            e->standingOn = map->terrain[nextY][nextX];
            char symbols[] = {'@', 'h', 'r', 'p', 'w', 's', 'e'};
            map->terrain[nextY][nextX] = symbols[e->type];
        }

        int moveCost = getCost(e->type, e->standingOn);
        heapPush(&h, e, e->y, e->x, currentTime + moveCost);
    }
}