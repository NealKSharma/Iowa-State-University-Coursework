#include <iostream>

using namespace std;

class singleton {
    private:
     static singleton *theInstance;
     singleton() {}
     singleton(singleton const &) {}
    
    public:
    //  static singleton *getInstance() {
    //     if (theInstance == nullptr){
    //         theInstance = new singleton();
    //     }
    //     return theInstance;
    //  }

    static singleton &getInstance() {
        static singleton theInstance;
        return theInstance;
     }
};

singleton *singleton::theInstance = nullptr;

int main () {
    for (int i = 0; i < 10; i++) {
        singleton &s = singleton::getInstance();
        cout << &s << endl;
    }
}