#include <iostream>

using namespace std;

int countCalls(){
    static int numcalls = 0;
    return ++numcalls;
}

class countInstances {
    // class variable
    static int count;
    public:
     countInstances() { count++; }
     static int getInstanceCount() { return count; }
};

int countInstances::count = 0;

int main(){
    for(int i = 0; i < 10; i++){ 
        countInstances ci;
        cout << countCalls() << endl;
    }

    // countInstances ci;
    cout << countInstances::getInstanceCount() << endl;

    return 0;
}