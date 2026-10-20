all: driver

driver: driver.o queue.o
	gcc driver.o queue.o -o driver

driver.o: driver.c queue.h
	gcc -c driver.c -o driver.o

queue.o: queue.c queue.h
	gcc -c queue.c -o queue.o

clean:
	rm driver queue.o driver.o