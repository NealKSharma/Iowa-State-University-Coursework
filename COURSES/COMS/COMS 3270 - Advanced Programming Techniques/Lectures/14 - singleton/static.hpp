#pragma once

extern float globalFloat;

int countCalls();

class countInstances {
    static int count;

    public:
     countInstances() { count++; };
     static int getInstanceCount() { return count; };
};

