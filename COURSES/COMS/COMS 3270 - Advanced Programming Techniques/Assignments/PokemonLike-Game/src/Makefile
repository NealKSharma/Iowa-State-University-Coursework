CC = gcc
CFLAGS = -g -Wall -Wextra -Wpedantic

all: main

main: main.o map.o entity.o
	$(CC) $(CFLAGS) main.o map.o entity.o -o main

main.o: main.c map.h entity.h
	$(CC) $(CFLAGS) -c main.c -o main.o

entity.o: entity.c entity.h map.h
	$(CC) $(CFLAGS) -c entity.c -o entity.o

map.o: map.c map.h
	$(CC) $(CFLAGS) -c map.c -o map.o

clean:
	rm -f main *.o