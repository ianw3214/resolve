#include "logger.hpp"

Logger::Logger() {
    head = nullptr;
    tail = nullptr;
}

void Logger::init() {
    QcE::get_instance()->getTextEngine()->createFont("logger", "resources/SairaSemiCondensed-Regular.ttf", LOGGER_TEXT_SIZE);
}

void Logger::log(const std::string& text) {
    SDL_Texture * texture = QcE::get_instance()->getTextEngine()->getTexture(text, "logger", {255, 255, 255, 255});
    if (tail != nullptr) {
        tail->next = new LoggerText(new Texture(texture), SDL_GetTicks());
        tail = tail->next;
    } else {
        head = new LoggerText(new Texture(texture), SDL_GetTicks());
        tail = head;
    }
}

void Logger::render() {
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