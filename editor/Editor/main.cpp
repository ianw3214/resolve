#include "core/engine.hpp"

#include "editor.cpp"

int main(int argc, char* argv[]) {

    QcEngine::createWindow("TEST", 500, 500, false, SDL_WINDOW_BORDERLESS);
    QcEngine::setRates(60, 24);
    QcEngine::setState(std::make_unique<Editor>());

    while(QcEngine::isRunning()) {
        QcEngine::update();
    }

    return 0;
}