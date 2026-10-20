#include <stdio.h>

char *words[] = {
    "alpha",
    "beta",
};

typedef struct {
    char *word;
    int d;
} mystruct;

int main(){
    mystruct s;
    s.word = words[1];

    printf("%s\n", s.word + 1);

    return 0;
}