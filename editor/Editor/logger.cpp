#pragma once
// Implementation for logger in the editor
// For now, only logs output
// In the future, want to implement full fledged console (probably)
#include "core/engine.hpp"

#include <deque>
#include <string>

#define LOGGER_TEXT_TIMEOUT 3000
// TODO: Make this scale based on window size?
#define LOGGER_TEXT_SIZE 16

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
    Logger() {
        head = nullptr;
        tail = nullptr;
    }
    void init() {
        QcE::get_instance()->getTextEngine()->createFont("logger", "resources/SairaSemiCondensed-Regular.ttf", LOGGER_TEXT_SIZE);
    }
    void log(const std::string& text){
        SDL_Texture * texture = QcE::get_instance()->getTextEngine()->getTexture(text, "logger", {255, 255, 255, 255});
        if (tail != nullptr) {
            tail->next = new LoggerText(new Texture(texture), SDL_GetTicks());
            tail = tail->next;
        } else {
            head = new LoggerText(new Texture(texture), SDL_GetTicks());
            tail = head;
        }
    }
    void render() {
        int counter = 0;
        LoggerText * it = head;
        while (it != nullptr) {
            if (SDL_GetTicks() - it->start_time > LOGGER_TEXT_TIMEOUT) {
                // Assume everything before it is already removed
                head = it->next;
                if (!head) tail = nullptr;
                delete it;
                it = head;
            } else {
                it->text->render(0, counter * LOGGER_TEXT_SIZE);
                counter++;
                it = it->next;
            }
        }
    }
};
