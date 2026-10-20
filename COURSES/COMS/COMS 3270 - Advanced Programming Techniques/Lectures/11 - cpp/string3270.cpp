#include "string3270.h"

#include <cstring>
#include <cstdlib>

string3270::string3270(){
    str = strdup("");
}

string3270::string3270(const char *s){
    str = strdup(s);
}

string3270::string3270(const string3270 &s){
    str = strdup(s.str);
}

string3270::~string3270(){
    free(str);
}

int string3270::length() const{
    strlen(str);
}

char *string3270::c_str() const{
    return str;
}

bool string3270::operator<(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) < 0;
}

bool string3270::operator<=(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) <= 0;
}
bool string3270::operator>(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) > 0;
}
bool string3270::operator>=(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) >= 0;
}
bool string3270::operator==(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) == 0;
}

bool string3270::operator!=(const string3270 &rhs) const{
    return strcmp(this->str, rhs.str) != 0;
}

string3270 string3270::operator+(const string3270 &rhs) const{
    string3270 ret;
    
    // Extreme dagner of a memory leak
    // ret.str = (char *) realloc(ret.str, strelen(str) + strlen(rhs.str) + 1);

    free(ret.str);
    ret.str = (char *) malloc(strlen(str) + strlen(rhs.str) + 1);
    //ret.str = strcpy(stpcpy(ret.str, str), rhs.str);
    //stpcpy is an extension hence why wont run on my windows locally need to be on pyrite.

    return ret;
}

string3270 &string3270::operator+=(const string3270 &rhs){
    string3270 ret;
    free(ret.str);
    ret.str = (char *) malloc(strlen(str) + strlen(rhs.str) + 1);
    strcpy(ret.str + 1, rhs.str);
    return *this;
}

string3270 string3270::operator+(const char *rhs) const{
    string3270 ret;
    int l = strlen(str);

    // Extreme danger of a memory leak
    ret.str = (char *) realloc(ret.str, l + strlen(rhs) + 1);
    strcpy(ret.str + 1, rhs);
    return *this;
}

string3270 &string3270::operator=(const string3270 &rhs){
    free(str);
    str = strdup(rhs.str);
    return *this;
}

string3270 &string3270::operator=(const char *rhs){
    free(str);
    str = strdup(rhs);
    return *this;
}

char &string3270::operator[](const int i) const{
    return str[i];
}

std::ostream &operator<<(std::ostream &o, string3270 &s){
    return o << s.c_str();
}