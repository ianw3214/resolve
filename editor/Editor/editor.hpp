#pragma once
#include "core/engine.hpp"

#include "logger.hpp"
#include "ui/widgets/widgetManager.hpp"

constexpr int base_tile_size = 64;

// TODO: Somehow input file paths or something

class Editor : public State {

    Logger logger;
    WidgetManager widgetManager;

public:

    Editor();
    ~Editor();

    void init() override;
    void cleanup() override;
    void pause() override;
    void resume() override;
    void update() override;
    void render() override;

    void set_brush_tile(int tile);
    void swap_tile(int x, int y, int tile_index);

private:
    // TILESHEET METADATA
    std::string m_tilesheet_src;
    int m_tile_size;
    int m_tilesheet_width;
    int m_tilesheet_height;

    int m_map_width;
    int m_map_height;

    std::vector<int> m_tilemap;

    // Editor state
    float m_tile_scale;
    int m_camera_x;
    int m_camera_y;
    int m_mouse_tile_x;
    int m_mouse_tile_y;

    int m_brush_tile;

    bool m_panning;
    int m_pan_start_mouse_x;
    int m_pan_start_mouse_y;
    int m_pan_start_camera_x;
    int m_pan_start_camera_y;

};