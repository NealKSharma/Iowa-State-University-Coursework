#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include <limits.h>
#include <string.h>
#include <curses.h>

#include "map.h"
#include "entity.h"

typedef struct {
    singleMap *world[401][401];
    int x, y, numTrainers;
    Player *pc;
} Game;

// void printDistanceMap(int dist[maxY][maxX]){
//     printf("\n");
//     for(int i = 0; i < maxY; i++){
//         for(int j = 0; j < maxX; j++){
//             if(dist[i][j] == INT_MAX){
//                 printf("   ");
//             } else {
//                 printf("%02d ", dist[i][j] % 100);
//             }
//         }
//         printf("\n");
//     }
// }

void generateMap(Game *game){
    setupMap(game->world[game->y][game->x]);

    // Either coordinate of the connecting gate / -1 for randomly generated gate / -2 for no gate (Gates cant be at a -ve value)
    int n = (game->y > 0 && game->world[game->y-1][game->x] != NULL) ? game->world[game->y-1][game->x]->sGate : -1;
    int s = (game->y < 400 && game->world[game->y+1][game->x] != NULL) ? game->world[game->y+1][game->x]->nGate : -1;
    int w = (game->x > 0 && game->world[game->y][game->x-1] != NULL) ? game->world[game->y][game->x-1]->eGate : -1;
    int e = (game->x < 400 && game->world[game->y][game->x+1] != NULL) ? game->world[game->y][game->x+1]->wGate : -1;
    // If the map is on the border dont generate gates at all
    if(game->y == 0) n = -2; 
    if(game->y == 400) s = -2;
    if (game->x == 0) w = -2;
    if (game->x == 400) e = -2;
    generatePaths(game->world[game->y][game->x], n, s, w, e);

    int distance = abs(game->x - 200) + abs(game->y - 200);
    int probability = 5; // Default value is 5%
    if(distance < 200) probability = ((-45 * distance) / 200) + 50;
    char pokeMart = ((rand() % 100) < probability || (game->x == 200 && game->y == 200)) ? 'M' : ' ';
    char pokeCentre = ((rand() % 100) < probability || (game->x == 200 && game->y == 200)) ? 'C' : ' ';
    generateBuildings(game->world[game->y][game->x], pokeMart, pokeCentre);

    generateTerrain(game->world[game->y][game->x]);
    initializePlayer(game->pc, game->world[game->y][game->x]);
    initializeEntities(game->world[game->y][game->x], game->numTrainers);

    game->world[game->y][game->x]->mapY = game->y;
    game->world[game->y][game->x]->mapX = game->x;
    
    // printMap(game->world[game->y][game->x]); 
    entityMovementLoop(game->world[game->y][game->x], game->pc, game->numTrainers); // INFINITE LOOP HERE

    // // TODO: Its being called on each movement. It's really unoptimized.
    // pathFinding(game->world[game->y][game->x], hiker, hikerDistance);
    // pathFinding(game->world[game->y][game->x], rival, rivalDistance);
    // printDistanceMap(hikerDistance);
    // printDistanceMap(rivalDistance);
}

void handleMovement(int changeY, int changeX, Game *game){
    if (game->x + changeX < 0 || game->x + changeX > 400 || game->y + changeY < 0 || game->y + changeY > 400) {
        printf("You have reached the edge of the world!\n\n");
        return;
    }

    game->x += changeX; game->y += changeY;
    if (game->world[game->y][game->x] == NULL) {
        game->world[game->y][game->x] = malloc(sizeof(singleMap));
        generateMap(game);
    } else {
        printMap(game->world[game->y][game->x]);
        // // TODO: Its being called on each movement. It's really unoptimized.
        // pathFinding(game->world[game->y][game->x], hiker, hikerDistance);
        // pathFinding(game->world[game->y][game->x], rival, rivalDistance);
        // printDistanceMap(hikerDistance);
        // printDistanceMap(rivalDistance);
    }
}

int main(int argc, char *argv[]){
    srand(time(NULL));

    Game *game = calloc(1, sizeof(Game)); 
    if (!game) return 1;

    game->y = 200;
    game->x = 200;
    game->numTrainers = 10;
    for (int i = 0; i < argc; i++){
        if(strcmp(argv[i], "--numtrainers") == 0){
            if(i + 1 < argc){
                game->numTrainers = atoi(argv[i+1]);
                i++;
            } else {
                printf("The --numtrainers flag requires a value.");
                free(game);
                exit(1);
            }
        }
    }

    if(game->numTrainers > 50) printf("\n\nIf the numtrainers is > 50, the program will likely get stuck in an infinite loop.\n\n");

    // Generate the initial map and entities
    game->pc = malloc(sizeof(Player));
    game->world[game->y][game->x] = malloc(sizeof(singleMap));
    generateMap(game);

    // Movement
    char ch, input[13]; // Max: "f -200 -200"
    while(1){
        printf("Current coordinates (x, y): (%d, %d)\n", game->x-200, game->y-200);
        printf("Move (n,s,w,e,f) or 'q': ");
        int i = 0;
        do{
            ch = getchar();
            if(i < 12) {  // Only store if there's room
                input[i] = ch;
                i++;
            }
        } while (ch != '\n');
        input[i-1] = '\0'; // Add Null terminator

        if(input[0] == 'q'){
            printf("Thanks for playing!");
            break;
        } else if(input[0] == 'f'){
            int flyX, flyY;
            if(sscanf(input+2, "%d %d", &flyX, &flyY) != 2){
                printf("Invalid fly command! Use format: f x y\n\n");
                continue;
            }
            if (flyX < -200 || flyX > 200 || flyY < -200 || flyY > 200) {
                printf("Invalid coordinates! Must be between -200 and 200.\n\n");
                continue;
            }

            game->y = flyY + 200; game->x = flyX + 200;
            if (game->world[game->y][game->x] == NULL) {
                game->world[game->y][game->x] = malloc(sizeof(singleMap));
                generateMap(game);
            } else {
                printMap(game->world[game->y][game->x]);
                // pathFinding(game->world[game->y][game->x], hiker, hikerDistance);
                // pathFinding(game->world[game->y][game->x], rival, rivalDistance);
                // printDistanceMap(hikerDistance);
                // printDistanceMap(rivalDistance);
            }
        } else {
            switch (input[0]) {
            case 'n': handleMovement(-1, 0, game); break;
            case 's': handleMovement(1, 0, game);  break;
            case 'w': handleMovement(0, -1, game); break;
            case 'e': handleMovement(0, 1, game);  break;
            default:  printf("Invalid command!\n\n");
            }
        }
    }

    for (int i = 0; i < 401; i++){
        for(int j = 0; j < 401; j++){
            if(game->world[i][j] == NULL) continue;
            for(int k = 0; k < game->numTrainers; k++){
                free(game->world[i][j]->entityList[k]);
            }
            free(game->world[i][j]->entityList);
            free(game->world[i][j]);
        }
    }
    free(game->pc);
    free(game);

    return 0;
}