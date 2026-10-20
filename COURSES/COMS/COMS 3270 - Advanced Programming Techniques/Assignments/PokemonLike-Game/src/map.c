#include <stdio.h>
#include <stdlib.h>
#include "map.h"

void setupMap(singleMap *map){
    for(int i = 0; i < maxY; i++){
        for(int j = 0; j < maxX; j++){
            if(i == 0 || i == maxY - 1 || j == 0 || j == maxX - 1){
                map->terrain[i][j] = '%';
            } else {
                map->terrain[i][j] = ' ';
            }
        }
    }
}

void generatePaths(singleMap *map, int n, int s, int w, int e){
    // Generating the enterances
    // If n/s/w/e is -ve then the gate needs to be assigned randomly otherwise its already assigned.
    map->nGate = (n<0) ? (rand() % (maxX - 4)) + 2 : n;
    map->sGate = (s<0) ? (rand() % (maxX - 4)) + 2 : s;
    // Makes it so they arent aligned too close
    while(abs(map->nGate - map->sGate) < 10 && (n<0 || s<0)){
        if(n<0) map->nGate = (rand() % (maxX - 4)) + 2; 
        if(s<0) map->sGate = (rand() % (maxX - 4)) + 2; 
    }

    map->wGate = (w<0) ? (rand() % (maxY - 4)) + 2 : w;
    map->eGate = (e<0) ? (rand() % (maxY - 4)) + 2 : e;
    while(abs(map->wGate - map->eGate) < 5 && (w<0 || e<0)){
        if(w<0) map->wGate = (rand() % (maxY - 4)) + 2;
        if(e<0) map->eGate = (rand() % (maxY - 4)) + 2;
    }

    // If n/s/w/e is -2 then visually a boulder is placed instead of a path at the border
    map->terrain[0][map->nGate] = (n == -2) ? '%' : '#'; // North
    map->terrain[maxY - 1][map->sGate] = (s == -2) ? '%' :  '#'; // South
    map->terrain[map->wGate][0] = (w == -2) ? '%' :  '#'; // West
    map->terrain[map->eGate][maxX - 1] = (e == -2) ? '%' :  '#'; // East

    // Connecting the enterances
    int currentX, currentY, direction;

    // North to South path
    currentX = map->nGate;
    currentY = 1;
    while(currentX != map->sGate || currentY != maxY - 1){
        map->terrain[currentY][currentX] = '#';
        direction = rand() % 4; // Favours left or right movement due to it being a rectangle.

        if((direction == 0) && currentY < maxY - 2){
            currentY++;
        } else if(currentX != map->sGate){
            if(currentX > map->sGate) currentX--;
            else currentX++;
        } else if(currentX == map->sGate && currentY < maxY - 1){
            currentY++;
        }
    }

    // West to East path
    currentX = 1;
    currentY = map->wGate;
    while(currentY != map->eGate || currentX != maxX - 1){
        map->terrain[currentY][currentX] = '#';
        direction = rand() % 4; // Favours right movement due to it being a rectangle.

        if((direction != 0) && currentX < maxX - 2){
            currentX++;
        } else if(currentY != map->eGate){
            if(currentY > map->eGate) currentY--;
            else currentY++;
        } else if(currentY == map->eGate && currentX < maxX - 1){
            currentX++;
        }
    }
}

void generateBuildings(singleMap *map, char pokeMart, char pokeCentre){
    char types[] = {pokeMart, pokeCentre}; // Could be ' ' or 'M' / 'C'
    const int numTypes = sizeof(types)/sizeof(types[0]);
    for (int i = 0; i < numTypes; i++) {
        if (types[i] == ' ') continue;
        while (1) {
            // Pick coordinates for top-left of 2x2 while staying away from borders
            int y = (rand() % (maxY - 8)) + 4;
            int x = (rand() % (maxX - 8)) + 4;
            // Check if a 2x2 square can be placed
            if (map->terrain[y][x] == ' '   && map->terrain[y][x+1] == ' ' &&
                map->terrain[y+1][x] == ' ' && map->terrain[y+1][x+1] == ' ') {
                // Check the surrounding of the square for a path
                if (map->terrain[y-1][x] == '#' || map->terrain[y-1][x+1] == '#' || map->terrain[y+2][x] == '#' || map->terrain[y+2][x+1] == '#' ||
                    map->terrain[y][x-1] == '#' || map->terrain[y+1][x-1] == '#' || map->terrain[y][x+2] == '#' || map->terrain[y+1][x+2] == '#'){
                        map->terrain[y][x] = types[i];
                        map->terrain[y][x+1] = types[i];
                        map->terrain[y+1][x] = types[i];
                        map->terrain[y+1][x+1] = types[i];
                        break;
                }
            }
        }
    }
}

void generateTerrain(singleMap *map){
    queueNode queue[maxY * maxX];
    int head = 0;
    int tail = 0;

    // Long Grass, Water, Clearing, Boulders
    char terrainTypes[] = {':', '~', '.', '%'};
    int seedCounts[] = {6, 1, 6, 1}; // Need to find the perfect balance.
    
    for(int i = 0; i < 4; i++){
        for(int j = 0; j < seedCounts[i]; j++){
            int y = (rand() % (maxY - 4)) + 2;
            int x = (rand() % (maxX - 4)) + 2;
            while(map->terrain[y][x] != ' '){
                y = (rand() % (maxY - 4)) + 2;
                x = (rand() % (maxX - 4)) + 2;
            }
            map->terrain[y][x] = terrainTypes[i];
            queue[tail].x = x;
            queue[tail].y = y;
            tail++;
        }
    }

    while(head < tail){
        int currentX = queue[head].x;
        int currentY = queue[head].y;
        head++;

        // TODO: Favour left and right terrain generation over up and down
        addToQueue(map, currentX + 1, currentY, currentX, currentY, queue, &tail); // Right
        addToQueue(map, currentX - 1, currentY, currentX, currentY, queue, &tail); // Left
        if (rand() % 4 == 0) {
            addToQueue(map, currentX, currentY + 1, currentX, currentY, queue, &tail); // Down
            addToQueue(map, currentX, currentY - 1, currentX, currentY, queue, &tail); // Up
        }
    }

    // Add 20 to 30 Trees
    int trees = (rand() % 20) + 10;
    for(int i = 0; i < trees; i++){
        int y = (rand() % (maxY - 4)) + 2;
        int x = (rand() % (maxX - 4)) + 2;
        while(map->terrain[y][x] != ':' && map->terrain[y][x] != '.' && map->terrain[y][x] != ' '){
            y = (rand() % (maxY - 4)) + 2;
            x = (rand() % (maxX - 4)) + 2;
        }
        map->terrain[y][x] = '^';
    }

    // Add 5 to 10 Flowers
    int flowers = (rand() % 5) + 5;
    for(int i = 0; i < flowers; i++){
        int y = (rand() % (maxY - 4)) + 2;
        int x = (rand() % (maxX - 4)) + 2;
        while(map->terrain[y][x] != ':' && map->terrain[y][x] != '.' && map->terrain[y][x] != ' '){
            y = (rand() % (maxY - 4)) + 2;
            x = (rand() % (maxX - 4)) + 2;
        }
        map->terrain[y][x] = '*';
    }

    // Check for empty squares (This is happening due to favouring right / left generation)
    // Probably need to find a better fix for it but this is the best I can think of right now.
    for(int i = 1; i < maxY - 1; i++){
        for(int j = 1; j < maxX - 1; j++){
            if(map->terrain[i][j] == ' '){
                // Stores neighbors and checks for border or inside boulrders
                char neighbors[] = {
                    i > 1 ? map->terrain[i-1][j] : ' ',
                    i < maxY-2 ? map->terrain[i+1][j] : ' ',
                    j > 1 ? map->terrain[i][j-1] : ' ',
                    j < maxX-2 ? map->terrain[i][j+1] : ' '
                };

                for(int k = 0; k < 4; k++){
                    if(neighbors[k] != ' ' && neighbors[k] != '#'){
                        map->terrain[i][j] = neighbors[k];
                        break;
                    }
                }
                // Safety check, just replace it with a flower.
                if (map->terrain[i][j] == ' ') map->terrain[i][j] = '*';
            }
        }
    }
}

void addToQueue(singleMap *map, int nextX, int nextY, int currentX, int currentY, queueNode queue[], int *tail) {
    if (nextX > 0 && nextX < maxX - 1 && nextY > 0 && nextY < maxY - 1) {
        if (map->terrain[nextY][nextX] == ' ') {
            map->terrain[nextY][nextX] = map->terrain[currentY][currentX];
            queue[*tail].x = nextX;
            queue[*tail].y = nextY;
            (*tail)++;
        } else if (map->terrain[nextY][nextX] == '#') { // Jump over the paths
            int jumpX = nextX + (nextX - currentX);
            int jumpY = nextY + (nextY - currentY);
            if (jumpX > 0 && jumpX < maxX - 1 && jumpY > 0 && jumpY < maxY - 1) {
                if (map->terrain[jumpY][jumpX] == ' ') {
                    map->terrain[jumpY][jumpX] = map->terrain[currentY][currentX];
                    queue[*tail].x = jumpX;
                    queue[*tail].y = jumpY;
                    (*tail)++;
                }
            }
        }
    }
}

void printMap(singleMap *map){
    printf("\n");
    for(int i = 0; i < maxY; i++){
        for(int j = 0; j < maxX; j++){
           printf("%c", map->terrain[i][j]);
        }
        printf("\n");
    }
}