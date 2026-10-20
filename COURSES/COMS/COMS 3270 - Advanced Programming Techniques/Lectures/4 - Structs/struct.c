#include <stdio.h>

struct foobar{
    int i;
    float f;
    char *c;
};

void populate_foobar(struct foobar *s, int i, float f, char *c){
    (*s).i = i;
    s->f = f;
    s->c = c;
}

int main(){
    struct foobar s;
    populate_foobar(&s, 0, 0, NULL);

    printf("%d %f %s\n", s.i, s.f, s.c);

    return 0;
}