#include "core/engine.hpp"

#include "editor.hpp"

int main(int argc, char* argv[]) {

    QcEngine::createWindow("TEST", 920, 720, false, SDL_WINDOW_BORDERLESS);
    QcEngine::setRates(60, 60);
    QcEngine::setState(std::make_unique<Editor>());

    while(QcEngine::isRunning()) {
        QcEngine::update();
    }

    return 0;
}