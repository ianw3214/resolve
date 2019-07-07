#include "editor.hpp"

#include <fstream>
#include "nlohmann/json.hpp"
using json = nlohmann::json;

#define ROOT "../"
#define FILE "res/maps/test.json"

#include <vector>
#include <string>

#include "ui/widgets/tilePaletteWidget.hpp"
#include "ui/widgets/mapPropertyWidget.hpp"

Editor::Editor() 
    : m_tile_scale(1.f)
    , m_camera_x(0)
    , m_camera_y(0) 
    , m_brush_tile(0)
{}

Editor::~Editor() {}

void Editor::init() {
    logger.init();
    widgetManager.init();
    // test_animatedTexture = new AnimatedTexture("res/animate.png");
    // test_animatedTexture->generateAtlas(64, 80);
    // test_animatedTexture->addAnimationState(0, 1);
    // test_animatedTexture->changeAnimation(0);
    // test_track = loadWAV("res/test.wav", false);
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

    // Initialize widgets widgets
    widgetManager.addWidget(new TilePaletteWidget(this, path));
    widgetManager.addWidget(new MapPropertyWidget(this));
}

void Editor::cleanup() {
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

void Editor::pause() {}
void Editor::resume() {}

void Editor::update() {
    if (keyPressed(SDL_SCANCODE_ESCAPE)) {
        exit();
    }
    if (getMouseScrollUp() > 0) {
        m_tile_scale += 0.1f * getMouseScrollUp();
    }
    if (getMouseScrollDown() > 0) {
        m_tile_scale -= 0.1f * getMouseScrollDown();
    }
    if (keyPressed(SDL_SCANCODE_SPACE)) {
        if (!m_panning) {
            m_panning = true;
            m_pan_start_mouse_x = getMouseX();
            m_pan_start_mouse_y = getMouseY();
            m_pan_start_camera_x = m_camera_x;
            m_pan_start_camera_y = m_camera_y;
        }
        m_camera_x = m_pan_start_camera_x + m_pan_start_mouse_x - getMouseX();
        m_camera_y = m_pan_start_camera_y + m_pan_start_mouse_y - getMouseY();
    } else {
        m_panning = false;
    }

    // Calculate the mouse tile positions
    m_mouse_tile_x = static_cast<int>((m_camera_x + getMouseX()) / (base_tile_size * m_tile_scale));
    m_mouse_tile_y = static_cast<int>((m_camera_y + getMouseY()) / (base_tile_size * m_tile_scale));
    if (getMouseX() + m_camera_x < 0) m_mouse_tile_x -= 1;
    if (getMouseY() + m_camera_y < 0) m_mouse_tile_y -= 1;

    // Handle mouse press events
    if (leftMousePressed()) {
        if (!widgetManager.click(getMouseX(), getMouseY())) {
            // EDIT IF NOT PANNING
            if (!m_panning) {
                swap_tile(m_mouse_tile_x, m_mouse_tile_y, m_brush_tile);
            }
        }
    }
}

void Editor::render() {
    // Calculate tile size initially to avoid redundant calculations
    int tile_size = static_cast<int>(std::ceil(static_cast<float>(base_tile_size) * m_tile_scale));
    // // Render animated textures
    // test_animatedTexture->render(0, 0);
    // // Render text
    // Texture testText(getTextTexture("test", "test", {200, 100, 100, 255}));
    // testText.render(200, 200);
    std::string texture_src(ROOT);
    texture_src += m_tilesheet_src;

    // TODO: Move this outside of the render function
    TileMap tiles(texture_src);
    tiles.generateTiles(m_tile_size, m_tile_size);

    for (int y = 0; y < m_map_height; ++y) {
        for (int x = 0; x < m_map_width; ++x) {
            // TODO: Better error handling
            unsigned int index = m_tilemap[y * m_map_width + x];
            tiles.render(
                x * tile_size - m_camera_x,
                y * tile_size - m_camera_y, 
                tile_size, 
                tile_size, 
                index
            );
        }
    }

    {   // Render the tile outline for the currently hovered over tile
        static Texture outline("resources/outline.png");
        outline.render(
            static_cast<int>(m_mouse_tile_x * tile_size - m_camera_x),
            static_cast<int>(m_mouse_tile_y * tile_size - m_camera_y),
            tile_size,
            tile_size
        );
    }

    logger.render();
    widgetManager.render();
}

void Editor::set_brush_tile(int tile) {
    m_brush_tile = tile;
}

void Editor::swap_tile(int x, int y, int tile_index) {
    // TODO: Make this an assert?
    if (tile_index > m_tilesheet_width * m_tilesheet_height) return;
    unsigned int index = y * m_map_width + x;
    if (index < m_tilemap.size()) {
        m_tilemap[index] = tile_index;
    }
}

void Editor::increase_map_width() {
    std::vector<int> newmap;
    int original_width = m_map_width++;
    for (int y = 0; y < m_map_height; ++y) {
        for (int x = 0; x < m_map_width; ++x) {
            int index = y * m_map_width + x;
            // These are the added tiles
            if ((index + 1) % m_map_width == 0) {
                newmap.push_back(0);
            }
            // These are original tiles
            else {
                newmap.push_back(m_tilemap[y * original_width + x]);
            }
        }
    }
    m_tilemap.swap(newmap);
}

void Editor::increase_map_height() {
    m_map_height++;
    for (int i = 0; i < m_map_width; ++i) m_tilemap.push_back(0);
}

void Editor::decrease_map_width() {
    std::vector<int> newmap;
    if (m_map_width <= 0) return;
    int original_width = m_map_width--;
    for (int y = 0; y < m_map_height; ++y) {
        for (int x = 0; x < m_map_width; ++x) {
            newmap.push_back(m_tilemap[y * original_width + x]);
        }
    }
    m_tilemap.swap(newmap);
}

void Editor::decrease_map_height() {
    if(m_map_height <= 0) return;
    m_map_height--;
    m_tilemap.resize(m_map_width * m_map_height);
}
