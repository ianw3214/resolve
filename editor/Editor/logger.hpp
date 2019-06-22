#pragma once
// Implementation for logger in the editor
// For now, only logs output
// In the future, want to implement full fledged console (probably)
#include "core/engine.hpp"

#define LOGGER_TEXT_TIMEOUT 3000
// TODO: Make this scale based on window size?
#define LOGGER_TEXT_SIZE 16

#include <deque>
#include <string>

struct LoggerText {
    LoggerText(Texture * t, Uint32 s) : text(t), start_time(s), next(nullptr) {}
    Texture * text;
    Uint32 start_time;
    LoggerText * next;
};

class Logger {
    LoggerText * head;
    LoggerText * tail;

public:
    Logger();
    void init();
    void log(const std::string& text);
    void render();
};