#include "core/engine.hpp"

#include <fstream>
#include "nlohmann/json.hpp"
using json = nlohmann::json;

// TODO: Somehow input file paths or something
#define ROOT "../"
#define FILE "res/maps/test.json"

#include <iostream>
#include <vector>
#include <string>

class Editor : public State {
public:
    
    ~Editor() {}

    void init() {
        // test_animatedTexture = new AnimatedTexture("res/animate.png");
        // test_animatedTexture->generateAtlas(64, 80);
        // test_animatedTexture->addAnimationState(0, 1);
        // test_animatedTexture->changeAnimation(0);
        // test_track = loadWAV("res/test.wav", false);
        // if (!test_track) {
        //     ERR("Something went wrong when trying to load WAV File");
        // }
        // createFont("test", "res/Munro.ttf", 20);
        std::string path(ROOT);
        path += FILE;

        std::ifstream file(path);
        if (file.is_open()) {
            json data;
            file >> data;

            json tilesheet = data["tilesheet"];
            m_tilesheet_src = tilesheet["source"];
            m_tile_size = tilesheet["tile_size"];
            m_tilesheet_width = tilesheet["width"];
            m_tilesheet_height = tilesheet["height"];
            
            m_map_width = data["width"];
            m_map_height = data["height"];

            // Can't directly copy to member for some reason?
            std::vector<int> temp = data["data"];
            m_tilemap = std::move(temp);
        } else {
            // TODO: Error logging
        }
    }

    void cleanup() {
        // TODO: Move deserialization to a 'save' button
        std::string path(ROOT);
        path += FILE;

        std::ofstream file(path);
        if (file.is_open()) {
            json data;
            
            json tilesheet;
            tilesheet["source"] = m_tilesheet_src;
            tilesheet["tile_size"] = m_tile_size;
            tilesheet["width"] = m_tilesheet_width;
            tilesheet["height"] = m_tilesheet_height;
            data["tilesheet"] = std::move(tilesheet);

            data["width"] = m_map_width;
            data["height"] = m_map_height;

            data["data"] = m_tilemap;
            file << data;
        } else {
            // TODO: Error logging
        }
    }
    void pause() {}
    void resume() {}

    void update() {
        if (keyPressed(SDL_SCANCODE_ESCAPE)) {
            exit();
        }
        // if (keyPressed(SDL_SCANCODE_S)) {
        //     playWAV(test_track);
        // }
        // if (keyPressed(SDL_SCANCODE_A)) {
        //     pauseWAV(test_track);
        // }
    }

    void render() {
        // Render normal textures
        // Texture test("res/animate.png");
        // test.render(100, 100);
        // // Render animated textures
        // test_animatedTexture->render(0, 0);
        // // Render text
        // Texture testText(getTextTexture("test", "test", {200, 100, 100, 255}));
        // testText.render(200, 200);
    }

private:
    // AnimatedTexture * test_animatedTexture;
    // WAV_track test_track;

    // TILESHEET METADATA
    std::string m_tilesheet_src;
    int m_tile_size;
    int m_tilesheet_width;
    int m_tilesheet_height;

    int m_map_width;
    int m_map_height;

    std::vector<int> m_tilemap;
};

int main(int argc, char* argv[]) {

    QcEngine::createWindow("TEST", 500, 500, false, SDL_WINDOW_BORDERLESS);
    QcEngine::setRates(60, 3);
    QcEngine::setState(std::make_unique<Editor>());

    while(QcEngine::isRunning()) {
        QcEngine::update();
    }

    return 0;
}