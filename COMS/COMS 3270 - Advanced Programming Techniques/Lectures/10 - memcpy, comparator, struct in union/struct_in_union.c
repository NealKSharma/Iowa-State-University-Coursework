// #define COND_CONF 0x0001
// #define COND_SLEP 0x0002
// #define COND_PARA 0x0004
// #define COND_POIS 0x0008

// typedef struct {
//  /* ... stuff */
//  char condition;
// } poke;

// typedef struct {
//  char conf : 1;
//  char slep : 1;
//  char para : 1;
//  char pois : 1;
// } cond_t;

typedef union {
    struct {
        char conf : 1;
        char slep : 1;
        char para : 1;
        char pois : 1;
    };
    char flags;
} cond_t;

struct pokemon
{
    /* ... stuff */
    cond_t condition;
} pikachu, charizard, lucario;

int main()
{
    // struct poke pikachu;

    // unset all conditions
    pikachu.condition.flags = 0;

    // confuse pikachu
    // pikachu.condition |= COND_CONF;
    pikachu.condition.conf = 1;

    return 0;
}